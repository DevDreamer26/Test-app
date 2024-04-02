import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../../firebaseConfig";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";

export default function AddPostScreen() {
  const [image, setImage] = useState(null);
  const db = getFirestore(app);
  const storage = getStorage();

  const [loading,setLoading] = useState();

  // const { user } = useUser();
  
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    getCategoryList();
  }, []);
  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, "Category"));

    querySnapshot.forEach((doc) => {
      console.log("Docs :", doc.data());
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmitMethod = async (value) => {
    // value.image = image;
    // console.log(value);
    setLoading(true);
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, "communityPost/" + Date.now() + ".jpg");

    // 'file' comes from the Blob or File API

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .then((response) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          console.log(downloadUrl);
          value.image = downloadUrl;
          // value.userName = user.fullName;
          // value.userEmail = user.primaryEmailAddress.emailAddress;
          // value.userImage = user.imageUrl

          // FORM DATA

          const docRef = await addDoc(collection(db, "UserPost"), value);
          if (docRef.id) {
            setLoading(false);
            Alert.alert('Success !','Post added successfuly !')
            console.log("Document added !");
          }
        });
      });
  };

  return (
    <View className="p-10">
      {/* <Text className="text-[30px] font-bold">Add your Post</Text>
      <Text className="text-[16px] text-grey-500 mb-7">
        Create and sell here
      </Text> */}
      <Formik
        initialValues={{
          title: "",
          desc: "",
          price: "",
          category: "",
          address: "",
        }}
        onSubmit={(value) => onSubmitMethod(value)}
        validate={(values) => {
          const errors = {};
          if (!values.title) {
            console.log("Title missing");
            ToastAndroid.show("Title must be there !", ToastAndroid.SHORT);
            errors.name = "Title must be there !";
          }
          return errors;
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setFieldValue,
        }) => (
          <View>
            <TouchableOpacity onPress={pickImage}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 100, height: 100 }}
                />
              ) : (
                <Image
                  source={require("../../assets/images/placeholder.jpg")}
                  style={{ width: 100, height: 100 }}
                />
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Title here"
              value={values.title}
              onChangeText={handleChange("title")}
            />
            <TextInput
              style={styles.input}
              placeholder="Write a description"
              numberOfLines={5}
              value={values.desc}
              onChangeText={handleChange("desc")}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="number-pad"
              value={values.price}
              onChangeText={handleChange("price")}
            />
            <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 15 }}>
              <Picker
                selectedValue={values?.category}
                onValueChange={(itemValue) =>
                  setFieldValue("category", itemValue)
                }
              >
                {categoryList &&
                  categoryList.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.name}
                      value={item.name}
                    />
                  ))}
              </Picker>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Address"
              value={values.address}
              onChangeText={handleChange("address")}
            />
            <TouchableOpacity
              onPress={handleSubmit}
              className="p-4 bg-blue-500 rounded-full mt-10"
              style={{
                backgroundColor:loading?'#ccc':'#007BFF'
              }}
              disabled={loading}
            >
              {
              loading?
              <ActivityIndicator color='#fff'/>:<Text className="text-center text-white text-[20px]">Submit</Text>
              }
              
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 17,
    textAlignVertical: "top",
    fontSize: 15,
  },
});
