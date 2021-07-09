import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity, Alert, Button, Share, ScrollView
} from "react-native"
import {Camera} from 'expo-camera'
import {COLORS, FONTS, SIZES, icons, images} from "../constants";
import * as Haptics from 'expo-haptics';
import QRCode from 'react-native-qrcode-svg';

const Scan = ({navigation}) => {
    const [hasPermission, setHasPermission] = React.useState(null);
    let qr = null;
    let counter = 0;
    React.useEffect(() => {
        (async () => {
            const {status} = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View/>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    function renderHeader() {
        return (
            <View style={{flexDirection: 'row', marginTop: SIZES.padding * 4, paddingHorizontal: SIZES.padding * 3}}>
                <TouchableOpacity
                    style={{
                        width: 45,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        Haptics.impactAsync();
                        navigation.navigate("Home")
                    }}
                >
                    <Image
                        source={icons.close}
                        style={{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.white
                        }}
                    />
                </TouchableOpacity>

                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: COLORS.white, ...FONTS.body3}}>Scan for Payment</Text>
                </View>

                <TouchableOpacity
                    style={{
                        height: 45,
                        width: 45,
                        backgroundColor: COLORS.primary,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        Haptics.impactAsync();
                        console.log("Share")
                        onShare()
                    }}
                >
                    <Image
                        source={icons.share}
                        style={{
                            height: 25,
                            width: 25,
                            tintColor: COLORS.white
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function renderScanFocus() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Image
                    source={images.focus}
                    resizeMode="stretch"
                    style={{
                        marginTop: "-95%",
                        width: 250,
                        height: 300
                    }}
                />
            </View>
        )
    }

    function renderPaymentMethods() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 375,
                    padding: SIZES.padding * 1,
                    borderTopLeftRadius: SIZES.radius,
                    borderTopRightRadius: SIZES.radius,
                    backgroundColor: COLORS.white
                }}
            >
                <Text style={{...FONTS.h2}}>Your QR-Code</Text>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        marginTop: SIZES.padding * 1
                    }}
                >
                    {displayQRCode()}
                </View>
                <Text style={{...FONTS.h4}}>Another payment methods</Text>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        marginTop: SIZES.padding * 1
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                        onPress={() => {
                            Haptics.impactAsync();
                            console.log('Phone Number')
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: COLORS.lightpurple,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10
                            }}
                        >
                            <Image
                                source={icons.phone}
                                resizeMode="cover"
                                style={{
                                    height: 25,
                                    width: 25,
                                    tintColor: COLORS.purple
                                }}
                            />
                        </View>
                        <Text style={{marginLeft: SIZES.padding, ...FONTS.body4}}>Phone Number</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: SIZES.padding * 2
                        }}
                        onPress={() => {
                            Haptics.impactAsync();
                            console.log("Barcode")
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: COLORS.lightGreen,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10
                            }}
                        >
                            <Image
                                source={icons.barcode}
                                resizeMode="cover"
                                style={{
                                    height: 25,
                                    width: 25,
                                    tintColor: COLORS.primary
                                }}
                            />
                        </View>
                        <Text style={{marginLeft: SIZES.padding, ...FONTS.body4}}>Barcode</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    function onBarCodeRead(result) {
        if (result.data != null) {
            if (counter == 0) {
                Alert.alert(
                    "QR-Code scanned successfully",
                    "Nice",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {text: "OK", onPress: () => console.log("OK Pressed")}
                    ],
                    {cancelable: false}
                );
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                console.log(result.data)
                qr = "https://de.wikipedia.org"//result.data
                displayQRCode(qr)
                counter++;
            }
        }
    }

    function displayQRCode(qr) {
        console.log(qr)
        return (
            <QRCode style={{marginLeft: 50}}
                    value={qr}
            />)

    }

    const onShare = async () => {
            try {
                const result = await Share.share({
                    url: "https://de.wikipedia.org/wiki/QR-Code",
                    message: 'This is a QR Code Sharing test'
                });
                if (counter == 1) {
                    if (result.action === Share.sharedAction) {
                        if (result.activityType) {
                            // shared with activity type of result.activityType
                        } else {

                        }
                        counter--;
                    } else if (result.action === Share.dismissedAction) {
                        // dismissed
                    }
                }
            } catch
                (error) {
                alert(error.message);
            }
        }
    ;

    return (
        <View style={{flex: 1, backgroundColor: COLORS.transparent}}>
            <Camera
                ref={ref => {
                    this.camera = ref
                }}
                style={{flex: 1}}
                captureAudio={false}
                type={Camera.Constants.Type.back}
                flashMode={Camera.Constants.FlashMode.off}
                onBarCodeScanned={onBarCodeRead}
                androidCameraPermissionOptions={{
                    title: "Permission to use camera",
                    message: "Camera is required for barcode scanning",
                    buttonPositive: "OK",
                    buttonNegative: "Cancel"
                }}
            >
                {renderHeader()}
                {renderScanFocus()}
                {renderPaymentMethods()}
            </Camera>

        </View>
    )
}

export default Scan;