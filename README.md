### Prerequisites
```bash
npm install -g @graphprotocol/graph-cli
yarn install
```

### Development
```bash
# Generate types from schema and ABIs
yarn codegen

# Build the subgraph
yarn build
```

### Deployment to Goldsky

1. **Login to Goldsky**
```bash
goldsky login
```

2. **Deploy to Goldsky**
```bash
# Copy schema to build directory
cp schema.graphql build/schema.graphql

# Deploy from build directory
cd build
goldsky subgraph deploy my-subgraph/1.0
```