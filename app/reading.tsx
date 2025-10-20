import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// Removed Select imports - using custom optimized selector
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Location } from '@/src/interface/dashboard';
import { loadDashboardInfo } from '@/src/middleware/dashboard';
import { addHistory } from '@/src/middleware/history';
import { createJob } from '@/src/middleware/job';
import { contaminantOptimizer, OptimizedContaminant } from '@/src/utils/contaminant-optimizer';
import STATUS from '@/src/utils/status';
import { convertToUTC, formatForDateTimeLocalInput } from '@/src/utils/timestamp';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, ScrollView } from 'react-native';
// import { v4 as uuidv4 } from 'uuid';
import useShowAlert from './screens/alert';

// ---------- Helpers with stable identity ----------

const FormSection = React.memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box className="mb-6">
    <Text className="text-lg font-semibold text-gray-900 mb-3">{title}</Text>
    {children}
  </Box>
));

const FormField = React.memo(({ label, children }: { label: string; children: React.ReactNode }) => (
  <VStack className="mb-4">
    <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
    {children}
  </VStack>
));

// Simple ID generator for React Native
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// ---------- Optimized Contaminant Selector (memo-wrapped) ----------

const ContaminantSelector = React.memo(function ContaminantSelectorInner({
  c,
  setContaminants,
  contaminant,
  setContaminant,
  showAlert,
}: {
  c: OptimizedContaminant[];
  setContaminants: (x: OptimizedContaminant[]) => void;
  contaminant: string;
  setContaminant: (x: string) => void;
  showAlert: ReturnType<typeof useShowAlert>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContaminant, setSelectedContaminant] = useState<OptimizedContaminant | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [displayedItems, setDisplayedItems] = useState(50);
  const searchInputRef = useRef<any>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (contaminant && c.length > 0) {
      const found = c.find(item => item.name === contaminant) || null;
      setSelectedContaminant(found);
    }
  }, [contaminant, c]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(localSearchQuery);
      setDisplayedItems(50);
    }, 300);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [localSearchQuery]);

  const [filteredContaminants, setFilteredContaminants] = useState<OptimizedContaminant[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (debouncedQuery.trim()) {
        const results = await contaminantOptimizer.searchContaminants(debouncedQuery, displayedItems);
        if (mounted) setFilteredContaminants(results);
      } else {
        const frequent = await contaminantOptimizer.getFrequentContaminants();
        if (mounted) setFilteredContaminants(frequent.slice(0, displayedItems));
      }
    })();
    return () => { mounted = false; };
  }, [debouncedQuery, displayedItems]);

  const hasMoreItems = useMemo(() => {
    if (debouncedQuery.trim()) {
      const allFiltered = c.filter(item =>
        item.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(debouncedQuery.toLowerCase()))
      );
      return allFiltered.length > displayedItems;
    }
    return c.length > displayedItems;
  }, [c, debouncedQuery, displayedItems]);

  const handleSelect = useCallback(async (item: OptimizedContaminant) => {
    setSelectedContaminant(item);
    setContaminant(item.name);
    setIsOpen(false);
    setLocalSearchQuery('');
    setDebouncedQuery('');
    await contaminantOptimizer.recordUsage(item.id);
  }, [setContaminant]);

  const handleClear = useCallback(() => {
    setSelectedContaminant(null);
    setContaminant('');
    setLocalSearchQuery('');
    setDebouncedQuery('');
  }, [setContaminant]);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      } else {
        setLocalSearchQuery('');
        setDebouncedQuery('');
        setDisplayedItems(50);
      }
      return next;
    });
  }, []);

  const loadMoreItems = useCallback(() => setDisplayedItems(prev => Math.min(prev + 50, c.length)), [c.length]);

  const renderContaminantItem = useCallback(
    ({ item }: { item: OptimizedContaminant }) => (
      <Pressable
        key={item.id}
        onPress={() => handleSelect(item)}
        className="p-3 border-b border-gray-100"
        style={{
          backgroundColor: selectedContaminant?.id === item.id ? '#f0f9ff' : 'white'
        }}
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      >
        <HStack className="items-center justify-between">
          <VStack className="flex-1">
            <Text className="text-base font-medium text-gray-900">
              {item.name}
            </Text>
            {!!item.description && (
              <Text className="text-sm text-gray-500 mt-1">
                {item.description}
              </Text>
            )}
          </VStack>
          {selectedContaminant?.id === item.id && (
            <MaterialIcons name="check" size={20} color="#3b82f6" />
          )}
        </HStack>
      </Pressable>
    ),
    [selectedContaminant, handleSelect]
  );

  return (
    <VStack>
      {/* Selector Trigger */}
      <Pressable
        onPress={handleToggle}
        className="border border-gray-300 p-4 rounded-lg bg-white"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        android_ripple={{ color: '#f0f0f0' }}
      >
        <HStack className="items-center justify-between">
          <VStack className="flex-1">
            <Text className="text-sm text-gray-500">Contaminant Type</Text>
            <Text className={`text-base font-medium ${selectedContaminant ? 'text-gray-900' : 'text-gray-400'}`}>
              {selectedContaminant?.name || 'Select contaminant type'}
            </Text>
            {selectedContaminant && (
              <Text className="text-xs text-green-600 mt-1">✓ Selected</Text>
            )}
          </VStack>
          <HStack className="items-center">
            {selectedContaminant && (
              <Pressable
                onPress={handleClear}
                className="w-6 h-6 items-center justify-center mr-2"
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <MaterialIcons name="clear" size={16} color="#ef4444" />
              </Pressable>
            )}
            <MaterialIcons
              name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={20}
              color="#6b7280"
            />
          </HStack>
        </HStack>
      </Pressable>

      {/* Dropdown */}
      {isOpen && (
        <Box
          className="mt-2 border border-gray-300 rounded-lg bg-white"
          style={{
            maxHeight: 300,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          {/* Search Input */}
          <Box className="p-3 border-b border-gray-200">
            <HStack className="items-center">
              <Input className="border border-gray-300 rounded-lg flex-1">
                <InputField
                  ref={searchInputRef}
                  placeholder="Search contaminants..."
                  value={localSearchQuery}
                  onChangeText={setLocalSearchQuery}
                  className="p-3"
                />
              </Input>
              {localSearchQuery.length > 0 && (
                <Pressable
                  onPress={() => setLocalSearchQuery('')}
                  className="ml-2 w-8 h-8 items-center justify-center"
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <MaterialIcons name="clear" size={16} color="#6b7280" />
                </Pressable>
              )}
              <Pressable
                onPress={async () => {
                  try {
                    const dashboardData = await loadDashboardInfo(true);
                    if (dashboardData?.contaminants) {
                      const optimized = await contaminantOptimizer.getOptimizedContaminants(dashboardData.contaminants);
                      setContaminants(optimized);
                      showAlert('Refreshed', 'Contaminants have been updated', 'success');
                    }
                  } catch (error) {
                    console.error('Error refreshing contaminants:', error);
                    showAlert('Error', 'Failed to refresh contaminants', 'error');
                  }
                }}
                className="ml-2 w-8 h-8 items-center justify-center"
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <MaterialIcons name="refresh" size={20} color="#3b82f6" />
              </Pressable>
              <Pressable
                onPress={() => setIsOpen(false)}
                className="ml-2 w-8 h-8 items-center justify-center"
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <MaterialIcons name="close" size={20} color="#6b7280" />
              </Pressable>
            </HStack>
          </Box>

          {/* Results Count */}
          {filteredContaminants.length > 0 && (
            <Box className="p-2 border-b border-gray-100">
              <Text className="text-xs text-gray-500 text-center">
                {filteredContaminants.length} contaminant{filteredContaminants.length !== 1 ? 's' : ''} found
              </Text>
            </Box>
          )}

          {/* Contaminants List */}
          <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator nestedScrollEnabled>
            {filteredContaminants.length > 0 ? (
              <>
                {filteredContaminants.map((item) => renderContaminantItem({ item }))}
                {hasMoreItems && (
                  <Pressable
                    onPress={loadMoreItems}
                    className="p-3 items-center border-t border-gray-200"
                    style={{ backgroundColor: '#f8fafc' }}
                  >
                    <Text className="text-sm text-blue-600 font-medium">
                      Load More ({Math.max(c.length - displayedItems, 0)} remaining)
                    </Text>
                  </Pressable>
                )}
              </>
            ) : (
              <Box className="p-4 items-center">
                <MaterialIcons name="search-off" size={32} color="#9ca3af" />
                <Text className="text-gray-500 mt-2 text-center">
                  {localSearchQuery ? 'No contaminants found' : 'No contaminants available'}
                </Text>
              </Box>
            )}
          </ScrollView>
        </Box>
      )}
    </VStack>
  );
});

// ---------- Screen ----------

export default function AddReadingScreen() {
  const [timestamp, setTimestamp] = useState(new Date());
  const [location, setLocation] = useState<Location | null>(null);
  const [c, setContaminants] = useState<Array<OptimizedContaminant>>([]);
  const [contaminant, setContaminant] = useState('');
  const [value, setValue] = useState('');
  const [isValueFocused, setIsValueFocused] = useState(false);
  const [useGPS, setUseGPS] = useState(false);
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const valueInputRef = useRef<any>(null);
  const router = useRouter();
  const isFormComplete = contaminant && value;
  const isDateValid = timestamp <= new Date();
  const canSave = isFormComplete && isDateValid;
  const { parameters, contaminants, from } = useLocalSearchParams();
  const showAlert = useShowAlert();

  // Stable handlers for inputs (prevents prop-churn remounts)
  const onChangeValue = useCallback((t: string) => setValue(t), []);
  const onChangeNotes = useCallback((t: string) => setNotes(t), []);

  useEffect(() => {
    const raw = Array.isArray(parameters) ? parameters[0] : parameters;

    const loadFreshContaminants = async () => {
      try {
        const dashboardData = await loadDashboardInfo(false);
        if (dashboardData?.contaminants) {
          const optimized = await contaminantOptimizer.getOptimizedContaminants(dashboardData.contaminants);
          setContaminants(optimized);
        }
      } catch (error) {
        console.error('Error loading fresh contaminants:', error);
        // Fallback to URL parameters if fresh data fails
        if (typeof contaminants === "string") {
          try {
            const parsedContaminants = JSON.parse(contaminants);
            contaminantOptimizer.getOptimizedContaminants(parsedContaminants)
              .then(optimized => setContaminants(optimized))
              .catch(() => setContaminants(parsedContaminants));
          } catch {
            // ignore malformed fallback
          }
        }
      }
    };

    loadFreshContaminants();

    try {
      const parsed = raw ? JSON.parse(raw) : null;
      setLocation(parsed || null);
    } catch {
      setLocation(null);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearFields = useCallback(() => {
    setTimestamp(new Date());
    setContaminant('');
    setValue('');
    setUseGPS(false);
    setNotes('');
    setIsValueFocused(false);
  }, []);

  const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newTimestamp = new Date(timestamp);
      newTimestamp.setFullYear(selectedDate.getFullYear());
      newTimestamp.setMonth(selectedDate.getMonth());
      newTimestamp.setDate(selectedDate.getDate());
      setTimestamp(newTimestamp);
    }
  }, [timestamp]);

  const handleTimeChange = useCallback((event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newTimestamp = new Date(timestamp);
      newTimestamp.setHours(selectedTime.getHours());
      newTimestamp.setMinutes(selectedTime.getMinutes());
      setTimestamp(newTimestamp);
    }
  }, [timestamp]);

  const handleSave = useCallback(async () => {
    if (!isFormComplete) return;

    const now = new Date();
    if (timestamp > now) {
      showAlert('Invalid Date', 'Reading time cannot be in the future. Please select a past date.', 'error');
      return;
    }

    try {
      const job = {
        id: generateId(),
        timestamp: convertToUTC(timestamp),
        contaminant: contaminant,
        value: parseFloat(value),
        useGPS: useGPS,
        notes: notes.trim(),
        location: location?.id,
        status: STATUS.PENDING_SYNC
      };

      const jobSuccess = await createJob(job);
      if (jobSuccess) {
        const historySuccess = await addHistory(job, true);
        if (historySuccess) {
          clearFields();
          showAlert('Success', 'Saved to queue', 'success');
        } else {
          showAlert('Error', 'Failed to add to history', 'error');
        }
      } else {
        showAlert('Error', 'Failed to save reading', 'error');
      }
    } catch (error) {
      console.error('Error saving reading:', error);
      showAlert('Error', 'Failed to save reading', 'error');
    }
  }, [isFormComplete, timestamp, contaminant, value, useGPS, notes, location?.id, showAlert, clearFields]);

  // ---------- Memoized styles to avoid new object refs each render ----------

  const valueBoxStyle = useMemo(() => ({
    borderColor: isValueFocused ? '#3b82f6' : '#d1d5db',
    borderWidth: isValueFocused ? 2 : 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }), [isValueFocused]);

  const gpsBoxStyle = useMemo(() => ({
    backgroundColor: useGPS ? '#f0f9ff' : '#f8fafc',
    borderWidth: 1,
    borderColor: useGPS ? '#3b82f6' : '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }), [useGPS]);

  const cardShadow = useMemo(() => ({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }), []);

  const headerShadow = useMemo(() => ({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  }), []);

  // ---------- Memoized Save Bar (prevents deep subtree churn while typing) ----------

  const SaveBar = useMemo(() => (
    <Box className="px-6 py-6 bg-white border-t border-gray-200">
      <Pressable
        onPress={handleSave}
        disabled={!canSave}
        className={`py-4 rounded-lg items-center ${canSave ? 'bg-blue-600' : 'bg-gray-300'}`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: canSave ? 0.2 : 0.1,
          shadowRadius: 4,
          elevation: canSave ? 4 : 2,
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        android_ripple={{ color: canSave ? '#ffffff20' : '#00000010' }}
      >
        <HStack className="items-center">
          <MaterialIcons name="save" size={20} color={canSave ? "white" : "#9ca3af"} />
          <Text className={`ml-2 font-semibold ${canSave ? 'text-white' : 'text-gray-500'}`}>
            {!isDateValid ? 'Invalid Date' : !isFormComplete ? 'Complete Form First' : 'Save Reading'}
          </Text>
        </HStack>
      </Pressable>
    </Box>
  ), [handleSave, canSave, isDateValid, isFormComplete]);

  return (
    <LinearGradient
      colors={['#A7C8FF', '#B9D5FF', '#FFFFFF']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Box className="flex-1">
        {/* Header */}
        <Box className="bg-white px-6 pt-12 pb-4" style={headerShadow}>
          <HStack className="justify-between items-center">
            <Text className="text-2xl font-bold text-gray-900">Add Reading</Text>
            <Pressable
              onPress={() => {
                if ((router as any).canGoBack?.()) {
                  router.back();
                } else {
                  router.push('/dashboard');
                }
              }}
              className="w-8 h-8 items-center justify-center"
            >
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </Pressable>
          </HStack>
        </Box>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} nestedScrollEnabled>

          {/* Basic Information */}
          <FormSection title="Basic Information">
            <FormField label="Timestamp">
              {Platform.OS === 'web' ? (
                <VStack>
                  <input
                    type="datetime-local"
                    className="border border-gray-300 p-3 rounded-lg w-full bg-white"
                    value={formatForDateTimeLocalInput(timestamp)}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const now = new Date();
                      if (selectedDate <= now) setTimestamp(selectedDate);
                    }}
                    max={formatForDateTimeLocalInput(new Date())}
                  />
                </VStack>
              ) : (
                <>
                  <Box className="border border-gray-300 p-4 rounded-lg bg-white" style={cardShadow}>
                    <HStack className="items-center justify-between">
                      <VStack className="flex-1">
                        <Text className="text-sm text-gray-500 mb-2">Reading Time</Text>
                        <HStack className="items-center">
                          <Pressable onPress={() => setShowDatePicker(true)} className="flex-1">
                            <Text className="text-base font-medium text-gray-900">
                              📅 {timestamp.toLocaleDateString()}
                            </Text>
                          </Pressable>
                          <Text className="text-gray-400 mx-2">at</Text>
                          <Pressable onPress={() => setShowTimePicker(true)} className="flex-1">
                            <Text className="text-base font-medium text-gray-900">
                              🕐 {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </Pressable>
                        </HStack>
                        {timestamp > new Date() && (
                          <Text className="text-xs text-red-500 mt-1">⚠️ Future dates are not allowed</Text>
                        )}
                      </VStack>
                      <Pressable onPress={() => setTimestamp(new Date())} className="w-8 h-8 items-center justify-center ml-2">
                        <MaterialIcons name="refresh" size={20} color="#3b82f6" />
                      </Pressable>
                    </HStack>
                    <Text className="text-xs text-gray-400 mt-2">
                      Tap date or time to change. Only past dates are allowed.
                    </Text>
                  </Box>

                  {showDatePicker && (
                    <DateTimePicker
                      value={timestamp}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}

                  {showTimePicker && (
                    <DateTimePicker
                      value={timestamp}
                      mode="time"
                      display="default"
                      onChange={handleTimeChange}
                    />
                  )}
                </>
              )}
            </FormField>

            <FormField label="Contaminant Type">
              <ContaminantSelector
                c={c}
                setContaminants={setContaminants}
                contaminant={contaminant}
                setContaminant={setContaminant}
                showAlert={showAlert}
              />
            </FormField>
          </FormSection>

          {/* Reading Details */}
          <FormSection title="Reading Details">
            <FormField label="Value">
              <Box
                className="flex-row items-center justify-between border p-4 rounded-lg bg-white"
                style={valueBoxStyle}
              >
                <Pressable
                  onPress={() => {
                    const newValue = (parseFloat(value || '0') - 0.1).toFixed(2);
                    setValue(newValue);
                  }}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#f3f4f6' }}
                >
                  <MaterialIcons name="remove" size={20} color="#6b7280" />
                </Pressable>

                <Input className="w-32 text-center border-0">
                  <InputField
                    ref={valueInputRef}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChangeValue}
                    placeholder="0.00"
                    className="text-center text-lg font-semibold"
                    returnKeyType="done"
                    blurOnSubmit={false}
                    selectTextOnFocus={false}
                    autoCorrect={false}
                    autoCapitalize="none"
                    clearButtonMode="never"
                    editable
                    multiline={false}
                    textAlign="center"
                    onFocus={() => setIsValueFocused(true)}
                    onBlur={() => setIsValueFocused(false)}
                    autoFocus={false}
                    caretHidden={false}
                  />
                </Input>

                <Pressable
                  onPress={() => {
                    const newValue = (parseFloat(value || '0') + 0.1).toFixed(2);
                    setValue(newValue);
                  }}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#f3f4f6' }}
                >
                  <MaterialIcons name="add" size={20} color="#6b7280" />
                </Pressable>
              </Box>
            </FormField>

            <FormField label="GPS Location">
              <Box className="flex-row items-center justify-between p-4 rounded-lg bg-white" style={gpsBoxStyle}>
                <HStack className="items-center">
                  <Box className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: useGPS ? '#3b82f6' : '#6b7280' }}>
                    <MaterialIcons name="gps-fixed" size={20} color="white" />
                  </Box>
                  <VStack>
                    <Text className="text-base font-medium text-gray-900">Use GPS</Text>
                    <Text className="text-sm text-gray-500">
                      {useGPS ? 'Location tracking enabled' : 'Location tracking disabled'}
                    </Text>
                  </VStack>
                </HStack>
                <Switch isChecked={useGPS} onToggle={() => setUseGPS(!useGPS)} />
              </Box>
            </FormField>
          </FormSection>

          {/* Additional Information */}
          <FormSection title="Additional Information">
            <FormField label="Notes (Optional)">
              <Input
                className="h-24 border border-gray-300 rounded-lg bg-white"
                style={cardShadow}
              >
                <InputField
                  multiline
                  numberOfLines={4}
                  placeholder="Add any comments or observations (e.g. cloudy sample, need filter cleaning)"
                  value={notes}
                  onChangeText={onChangeNotes}
                  className="p-4"
                  blurOnSubmit={false}
                  returnKeyType="default"
                  autoCorrect
                  autoCapitalize="sentences"
                  textAlignVertical="top"
                  scrollEnabled
                />
              </Input>
            </FormField>
          </FormSection>

        </ScrollView>

        {/* Save Button - Fixed at bottom */}
        {SaveBar}
      </Box>
    </LinearGradient>
  );
}
