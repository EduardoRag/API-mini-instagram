# Mini Insta

## O que o usuário pode fazer

- Fazer login
- Fazer Cadastro
- Ver os dados do perfil
- Editar dados do perfil
- Ver postagens de outras pessoas
    - Ver quantidade de curtidas em uma postagem
    - Ver comentários em uma postagem
- Curtir postagens de outras pessoas
- Comentar em postagens

---

## O que não será possível fazer

- Ver localização de uma postagem
- Ver pessoas que curtiram uma postagem
- Curtir comentário
- Comentar em outros comentários
- Descurtir postagem


## Endpoints

---

### POST - Login

#### Dados enviados
- username
- senha

#### Dados retornados
- sucesso / erro
- token

#### Objetivos gerais
- Validar username e senha
- Buscar o username no banco de dados
- Verificar se a senha informada está correta
- Gerar o token de autenticação
- Retornar os dados do usuário e o token

---

### POST - Cadastro

#### Dados enviados
- username
- senha

#### Dados retornados
- sucesso / erro

#### Objetivos gerais
- Validar username e senha
- Verificar se username já existe no banco de dados
- Criptografar a senha
- Cadastrar usuario no banco de dados
- Retornar sucesso ou erro

---

### GET - Informações de perfil

#### Dados enviados
- token (para receber id ou username)

#### Dados retornados
- URL da foto de perfil
- nome
- username
- site
- biografia
- email
- telefone
- gênero

#### Objetivos gerais
- Validar o token do usuario
- Buscar o cadastro do usuario no banco de dados com a informação do token
- Retornar os dados do usuario

---
### PUT - Editar informações de perfil

#### Dados enviados
- token
- nome
- username
- site
- biografia
- email
- telefone
- gênero
- senha

#### Dados retornados
- sucesso / erro

#### Objetivos gerais
- Validar o token
- Buscar o usuario no banco de dados
- Exigir ao menos um campo para atualizar
- Criptografar a senha se for informada
- Verificar se o email e username já existe no banco de dados caso for informado
- Atualizar o registro do usuario no banco de dados
- Retornar sucesso ou erro

---

### GET - Postagens

#### Dados enviados
- token (para receber id ou username)
- offset

#### Dados retornados
- Postagens [array de postagens]
    - id
    - legenda do post
    - foi curtido por mim
    - Usuario
        - URL da foto de perfil
        - username
        - É perfil verificado
    - Fotos [uma ou mais fotos]
    - quantidade de curtidas
    - Comentários [um ou mais comentários]
        - username
        - texto
    - Data

#### Objetivos gerais
- Validar o token
- Buscar o usuario no banco de dados
- Retornar postagens de outras pessoas

---

### POST - Postagens

#### Dados enviados
- token (para receber id ou username)
- texto
- array com fotos

#### Dados retornados
- sucesso ou erro

#### Objetivos gerais
- Validar o token
- Buscar o usuario no banco de dados
- Exigir pelo menos uma foto no array
- Cadastrar postagem para o usuario logado
- Cadastro das fotos da postagem
- Retornar sucesso ou erro

---

### POST - Curtir

#### Dados enviados
- token (contem username ou id do usuario)
- id da postagem

#### Dados retornados
- sucesso / erro

#### Objetivos gerais
- Validar o token
- Buscar o usuario no banco de dados
- Buscar o cadastro da postagem com o id informado
- Verificar se o usuário já curtiu a postagem
- Cadastrar curtida da postagem no banco de dados
- Retornar sucesso ou erro

---

### POST - Comentar

#### Dados enviados
- token (contem username ou id do usuario)
- id da postagem
- texto

#### Dados retornados
- sucesso / erro

#### Objetivos gerais
- Validar o token
- Buscar o usuario no banco de dados
- Validar se foi informado um texto
- Buscar postagem com o id informado
- Cadastrar o comentário da postagem no banco de dados
- Retornar sucesso ou erro