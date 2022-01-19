<br/>
<br/>

# Database

## 1. Tabel List

- blog
  - columns
    - id: int/uuid
    - author (Foreign key): int/uuid
    - created_at: date
    - modified_at: date
    - published_at: date
    - slug: varchar
    - title: varchar
    - description: varchar
    - content: richtext
    - blog_image_url: varchar
- user
  - columns
    - id: int/uuid
    - username: varchar
    - email: varchar
    - password: varchar
    - created_at: date
    - fullname: varchar
    - avatar_url: varchar
