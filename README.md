>## Random get image

# insert-api-data README

This is the README for extension "insert-api-data". 


## Extension Settings

| Name                      |      Type       | Description                                                                                 |
| :------------------------ | :-------------: | :------------------------------------------------------------------------------------------ |
| `api.url`                 |    `String`     | Api 接口地址 <br> api address.                                                    |


## Api Return Json

key值必须为`image_medium`.
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "image_medium": "https://"
    }
}
```