const sampleData = `{
  "serviceName": "core-event-broker-service",
  "author": "{your_email}@taptap.com.vn",
  "authorizedPerson": "{authorized_person_email}@taptap.com.vn",
  "isPublic": false,
  "version": "2021.05.22 build 1",
  "monitoring": {
    "endpointPublicUrl": "https://event-broker.taptap.com.vn/health",
    "endpointPrivateUrl": "{internal_domain_access}/health",
    "alertTo": [
      {
        "name": "{person_name}",
        "email": "{person_email}@taptap.com.vn",
        "phone": "{person_phone_number}"
      }
    ],
    "alertBot": {
      "name": "telegram",
      "botEndpoint": "https://telegram...."
    }
  },
  "requirement": {
    "domain": "https://event-broker.taptap.com.vn",
    "port": "xxx",
    "platform": "java",
    "serviceDependencies": [
      { "name": "rating-service" },
      { "name": "orc-engine-service" }
    ],
    "ownDependencies" : [],
    "infrastructure": {
      "java": true,
      "mongodb": true,
      "redis": true,
      "hazelcast": true,
      "kafka": true,
      "elasticSearch": false,
      "nodejs": false
    },
    "database": {
      "mongodb": {
        "dbName": "core_loyalty_webhook"
      }
    }
  }
}`;
export default sampleData;
