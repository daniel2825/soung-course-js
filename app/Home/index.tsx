import { Image ,Text, View } from "react-native";
import Colors from '../../constants/Colors'


const Home = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.BLACK
      }}
    >
      <Image source={require('../../assets/images/jair-santrich.png')}
        style={{
          width: '100%',
          height: 300
        }}
      />
      <View style={{
        padding: 25,
        backgroundColor: Colors.BACKGROUND,
        height: '100%',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35
      }}>
           <Text style={{
            fontWeight: 'bold',
            textAlign: 'center'
           }}>BIENVENIDOS AL CURSO DE CANTO</Text>
      </View>
    </View>
  );
};

export default Home;

