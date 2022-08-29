# Description

This action is meant to be used in CD pipelines and publishes your package and creates a release in Github using the version number from `package.json`.


# Example usage

```
uses: icanbwell/publish-mfe-release@1.0.0
with:
  registry-auth-token: ${{secrets.BWELL_DEV_PAT}}
  registry-scope: '@icanbwell'
```
