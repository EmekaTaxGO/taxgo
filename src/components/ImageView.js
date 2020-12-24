import React, { useState } from 'react';
import { Image } from 'react-native';
const ImageView = props => {

    const [image, setImage] = useState({ uri: props.url });


    const isUrlValid = () => {
        const { url } = props;
        return url !== undefined && url !== null && url.length > 0
    }
    return <Image
        {...props}
        source={isUrlValid() ? image : props.placeholder}
        onError={err => {
            setImage(props.placeholder)
        }}
    />
}
export default ImageView;