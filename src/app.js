const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  //lista todos os repositorios
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  //campos para repositorios criados
  const { title, url, techs } = request.body;

  //repositorio que vai ser criado
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  //adicionando um repositorio 
  repositories.push(repository);

  //adicionando aos outros repositorios
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs } = request.body;

  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(findRepositoryIndex === -1){
    return response.status(400).json({ error: 'Repository does not exists' });
  }
  
  const repository = {
    id,
    title,
    url,
    techs, 
    likes: repositories[findRepositoryIndex].likes,
  };

  repositories[findRepositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  //pega o id
  const { id } = request.params;

  //busca o id
  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);

  console.log(findRepositoryIndex)

  if(findRepositoryIndex >= 0){
    //deleta uma posição do id
    repositories.slice(findRepositoryIndex, 1);
  }else{
    return response.status(400).json({ error: 'Repository not found' })
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  //verifica se o repositorio está vazio
  if(!repository){
    return response.status(400).send();
  }

  //adiciona a cada like a cada requisição
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;