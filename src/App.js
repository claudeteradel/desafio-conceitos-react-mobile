import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);
  
  async function handleLikeRepository(id) {
    const response = await api.post('repositories/' + id + '/like', {});
    
    if (response.status == 200){
      
      const repositoryIndex = repositories.findIndex(repository => repository.id == id);
      
      if (repositoryIndex >= 0){
        repositories.splice(repositoryIndex, 1, response.data);
        setRepositories([ ...repositories]);
      }
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        {repositories.map(repository => (
        <View style={styles.repositoryContainer} key={`view-${repository.id}`}>
          <Text style={styles.repository} 
                key={`text-${repository.id}`}>
                    {repository.title}
          </Text> 

          <View style={styles.techsContainer} key={`view-tech-${repository.id}`}>
          {repository.techs.map(tech => (
            <Text style={styles.tech} 
                  key={`repository-${repository.id}-${tech}`}
                  >
              {tech}
            </Text>
          ))}
          </View>

          <View style={styles.likesContainer} key={`view-likes-${repository.id}`}>
            <Text
              style={styles.likeText}
              testID={`repository-likes-${repository.id}`}
              key={`repository-likes-${repository.id}`}
              >
              {repository.likes} {repository.likes == 1 ? ' curtida' : ' curtidas'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLikeRepository(repository.id)}
            testID={`like-button-${repository.id}`}
            key={`like-button-${repository.id}`}
          >
            <Text style={styles.buttonText} 
                  key={`likes-${repository.id}`}>Curtir</Text>
          </TouchableOpacity>
          
        </View>
        ))} 
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
