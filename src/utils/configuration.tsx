
const db_config = [
    {
        connection_string: "abp",
        config: {
            URL: "https://abp-api.irvineas.com",
            SECRET_KEY: "$abps3(Re4Key!",
        },
    },
    {
        connection_string: "cantilan",
        config: {
            URL: "https://cantilanwd-api.irvineas.com",
            SECRET_KEY: "$c4nt1l4ns3(Re4Key!",
        },
    },
    {
        connection_string: "thepalms",
        config: {
            URL: "https://cantilanwd-api.irvineas.com",
            SECRET_KEY: "$th3P4lMss3(Re4Key!",
        },
    },

    // for testing only
    {
        connection_string: "dev_environment",
        config: {
            URL: "http://localhost:5000/api",
            SECRET_KEY: "secret_key",
        },
    },
];

export function getDBConfig(connection_string: string) {
    return db_config.find(cfg => cfg.connection_string === connection_string)?.config;
}
