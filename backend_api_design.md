# API Endpoints

## 1. Blog List

- Endpoint: /api/blog
- Method: GET
- Headers: -
- Request
  - Parameter: -
  - Query: -
  - Body: -
- Response:

```
{
    status: Ok,
    message: '',
    data:
    {
        [
            {
                id,
                author,
                created_at
                modified_at
                published_at
                slug
                title
                description
                content
                blog_image_url
            },
        ]
    }
}
```

## 2. Single Blog

- Endpoint: /api/blog/:id
- Method: GET
- Headers: -
- Request
  - Parameter: id
  - Query: -
  - Body: -
- Response:

```
{
    status: Ok/Not Found,
    message: ''/'Not Found',
    data:
    {
        {
            id,
            author,
            created_at
            modified_at
            published_at
            slug
            title
            description
            content
            blog_image_url
        },
    }
}
```

## 3. Create Blog

- Endpoint: /api/blog/
- Method: POST
- Headers:
  - Auth beared: token
- Request

  - Parameter: -
  - Query: -
  - Body:

  ```
  {
      title,
      description,
      content,
      blog_image_url,
  }
  ```

- Response:

```
{
    status: Created/Not Authorize/Bad Request,
    message: 'Blog Created'/'Not Authorize'/'Bad request',
    data:
    {

    }
}
```

## 4. User Register

- Endpoint: /api/auth/register
- Method: POST
- Headers: -
- Request

  - Parameter: -
  - Query: -
  - Body:

  ```
  {
      username,
      email,
      password,
      fullname,
      image_url
  }
  ```

- Response:

```
{
    status: Created/Not Found/Bad Request,
    message: 'User Created'/'User already exist'/'Bad request',
    data:
    {

    }
}
```

## 5. User Login

- Endpoint: /api/auth/login
- Method: POST
- Headers: -
- Request

  - Parameter: -
  - Query: -
  - Body:

  ```
  {
      username,
      password,
  }
  ```

- Response:

```
{
    status: Ok/Not Found/Bad Request,
    message: ''/'User does not exist'/'Bad request',
    data:
    {
        user: {
            username,
            image_url,
            email
        },
        token
    }
}
```

<br/>
<br/>
