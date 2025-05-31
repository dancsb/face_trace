module.exports = {
    frontend: process.env.RUN_CONFIG === 'testing'
        ? 'http://localhost'
        : process.env.RUN_CONFIG === 'production'
            ? 'https://facetrace.dancs.org'
            : 'http://localhost:4200',
    backend: process.env.RUN_CONFIG === 'testing'
        ? 'http://localhost:8080'
        : process.env.RUN_CONFIG === 'production'
            ? 'https://api.facetrace.dancs.org'
            : 'http://localhost:4080'
};
