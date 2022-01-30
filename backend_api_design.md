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

- Endpoint: /api/user/register
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
        id: string;
        username: string;
        fullname: string;
        image_url: string;
        email: string;
        role: Role;
        createdAt: Date;
    }
}
```

## 5. User Login

- Endpoint: /api/auth/login
- Method: POST
- Headers: Authorization: Bearer token
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
        access_token
    }
}
```

## 6. Find All User

- Endpoint: /api/user
- Method: GET
- Headers: Authorization: Bearer token
- Request

  - Parameter: -
  - Query: -
  - Body:

- Response:

```
{
    status: Ok/Unauthorized/Forbidden,
    message: 'OK'/'Not Authorized'/'Forbidden Resource',
    data:
    {
        [
            {
                id: string;
                username: string;
                fullname: string;
                image_url: string;
                email: string;
                role: Role;
                createdAt: Date;
            },
            .
            .
            .
        ]
    }
}
```

## 6. Find One User

- Endpoint: /api/user/id
- Method: GET
- Headers: Authorization: Bearer token
- Request

  - Parameter: user id
  - Query: -
  - Body:

- Response:

```
{
    status: Ok/Not Found/Unauthorized/Forbidden,
    message: 'OK'/'User not found'/'Not Authorized'/'Forbidden Resource',
    data:
    {
        {
            id: string;
            username: string;
            fullname: string;
            image_url: string;
            email: string;
            role: Role;
            createdAt: Date;
        }
    }
}
```

## 7. Delete One User

- Endpoint: /api/user/id
- Method: DELETE
- Headers: Authorization: Bearer token
- Request

  - Parameter: user id
  - Query: -
  - Body:

- Response:

```
{
    status: Ok/Not Found/Unauthorized/Forbidden
    message: 'User deleted'/'User not found'/'Not Authorized'/'Forbidden Resource',
    data:
    {
        username: string;
    }
}
```

<br/>
<br/>
