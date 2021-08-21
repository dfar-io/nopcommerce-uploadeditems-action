# nopCommerce uploadedItems.json creator action

This action creates an `uploadedItems.json` file based on the source code provided.

## Inputs

## `plugin-name`

**Required** The name of the plugin, for example, `Nop.Plugin.Widgets.YourWidget`

## Example usage

```
uses: actions/nopcommerce-uploadeditems-action@v0.1
with:
  plugin-name: 'Nop.Plugin.Widgets.Bronto'
```
