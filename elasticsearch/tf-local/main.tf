// setup everything for the local elasticsearch docker local
terraform {
  required_providers {
    elasticstack = {
      source  = "elastic/elasticstack"
      version = "0.11.3"
    }
  }
}

provider "elasticstack" {
  elasticsearch {
    username  = "elastic"
    password  = var.elastic_pwd
    endpoints = ["https://localhost:9200"]
    ca_file = abspath("${path.root}/../http_ca.crt")
    
  }
}

resource "elasticstack_elasticsearch_index" "learning_path" {
  name = "learning-paths"

  mappings = jsonencode({
    properties = {
      title = { type = "text" }
      description = { type = "text" }
      title_vector = { type = "dense_vector", dims = 1536, index = true, similarity = "cosine" }
      description_vector = { type = "dense_vector", dims = 1536, index = true, similarity = "cosine" }
    }
  })
}