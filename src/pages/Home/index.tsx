import React, { useEffect, useState } from 'react';
import { View, Image, ImageBackground, Text, StyleSheet } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

export type RootStackParamList = {
  Points: {
    id?: string
  };
};

interface IBGUFResponse {
  sigla: string;
}

interface IBGCityResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [ ufs, setUfs ] = useState<string[]>([]);
  const [ cities, setCities ] = useState<string[]>([]);

  const [ selectedUf, setSelectedUf ] = useState<string>('0');
  const [ selectedCity, setSelectedCity ] = useState<string>('0');

  function handleNavigationToPoints() {
    navigation.navigate('Points', { id: '' })
  }

  
  useEffect(() => {
      axios.get<IBGUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
          .then(response => {
              const ufInitials = response.data.map(uf => uf.sigla);
              setUfs(ufInitials);
          })
  }, [])

  // Load cities when UF changes
  useEffect(() => {
      if (selectedUf === '0') return setCities([])

      axios
          .get<IBGCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
          .then(response => {
              const cityNames = response.data.map(city => city.nome)
              setCities(cityNames)
          })

  }, [selectedUf])


  function formatSelectOptions(data:Array<string>) {
    const selectOptions: { label: string; value: string; }[] = [];

    data.map(item => selectOptions.push(
      { label: item, value: item }
    ))

    return selectOptions;
  }

  function handleSelectUf(uf: string) {
      setSelectedUf(uf);
  }

  function handleSelectCity(city: string) {
      setSelectedCity(city);
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.footer}>

      <RNPickerSelect
          style={pickerStyle}
          onValueChange={(value) => handleSelectUf(value)}
          items={formatSelectOptions(ufs)}
      />

      <RNPickerSelect
            style={pickerStyle}
            onValueChange={(value) => handleSelectCity(value)}
            items={formatSelectOptions(cities)}
        />

        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

const pickerStyle = {
	inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#322153'
	},
	inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#322153'
	},
	placeholderColor: 'white',
	underline: { borderTopWidth: 0 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;