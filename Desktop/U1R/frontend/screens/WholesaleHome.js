import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function WholesaleHome() {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 75;
  const contentBottomPadding = TAB_BAR_HEIGHT + insets.bottom;

  return (
    <SafeAreaView style={styles.safe}>

      {/* WRAPPER TO PREVENT OVERLAP */}
      <View style={[styles.contentWrapper, { paddingBottom: contentBottomPadding }]}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerSub}>Find Your All Shop Need</Text>
            <Text style={styles.headerMain}>UnderOneRoof</Text>

            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color="#777" />
              <TextInput placeholder="Search here.." style={styles.searchInput} />
            </View>
          </View>

          {/* BANNERS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 15 }}>
            <Image source={{ uri: "https://i.ibb.co/PwvrPHn/banner1.jpg" }} style={styles.banner} />
            <Image source={{ uri: "https://i.ibb.co/WPrKTym/banner2.jpg" }} style={styles.banner} />
          </ScrollView>

          {/* BESTSELLERS */}
          <Text style={styles.sectionTitle}>Bestsellers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 15 }}>
            {bestsellers.map((item, i) => (
              <View key={i} style={styles.smallCard}>
                <Image source={{ uri: item.image }} style={styles.smallImg} />
                <Text style={styles.smallText}>{item.title}</Text>
              </View>
            ))}
          </ScrollView>

          {/* SHOP BY CATEGORY */}
          <Text style={styles.sectionTitle}>Shop By Category</Text>
          <View style={styles.grid}>
            {categories.map((item, i) => (
              <View key={i} style={styles.gridItem}>
                <Image source={{ uri: item.image }} style={styles.gridImg} />
                <Text style={styles.gridText}>{item.title}</Text>
              </View>
            ))}
          </View>

          {/* FEATURED */}
          <Text style={styles.sectionTitle}>Featured this week</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 15 }}>
            {featured.map((img, i) => (
              <Image key={i} source={{ uri: img }} style={styles.featureImg} />
            ))}
          </ScrollView>

          {/* PRODUCTS */}
          <Text style={styles.sectionTitle}>Dry Fruit Masala & Oil</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 15 }}>
            {products.map((item, i) => (
              <View key={i} style={styles.productCard}>
                <Image source={{ uri: item.image }} style={styles.productImg} />
                <View style={styles.addBtn}>
                  <Text style={{ color: "#2E7D32", fontWeight: "700" }}>ADD</Text>
                </View>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>₹{item.price}</Text>
              </View>
            ))}
          </ScrollView>

          {/* EVENTS */}
          <Text style={styles.sectionTitle}>Events this week</Text>
          <View style={styles.eventRow}>
            {events.map((img, i) => (
              <Image key={i} source={{ uri: img }} style={styles.eventImg} />
            ))}
          </View>

        </ScrollView>
      </View>

      {/* FIXED BOTTOM BAR */}
      <View
        style={[
          styles.bottomTabs,
          {
            paddingBottom: Math.max(insets.bottom, 10),
            height: TAB_BAR_HEIGHT + insets.bottom,
          },
        ]}
      >
        <Tab icon="home" label="Home" active />
        <Tab icon="grid" label="Category" />
        <Tab icon="cart" label="Cart" />
        <Tab icon="person" label="Account" />
      </View>

    </SafeAreaView>
  );
}

/* Bottom tab component */
const Tab = ({ icon, label, active }) => (
  <TouchableOpacity style={{ alignItems: "center" }}>
    <Ionicons name={icon} size={24} color={active ? "#FF3B30" : "#777"} />
    <Text
      style={{
        color: active ? "#FF3B30" : "#777",
        fontSize: 12,
        marginTop: 2,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

/* ---------------- MOCK DATA ---------------- */
const bestsellers = [
  { title: "Dry fruits", image: "https://i.ibb.co/v1Z3dRh/seeds.jpg" },
  { title: "Sundried Fruits", image: "https://i.ibb.co/r0B0Shn/sundried.jpg" },
  { title: "MDH", image: "https://i.ibb.co/QXx9LHR/mdh.png" },
  { title: "Flavoured", image: "https://i.ibb.co/NWqV2xg/flavoured.jpg" },
];

const categories = [
  { title: "Dry fruits", image: "https://i.ibb.co/DVFqvBv/dryfruits.jpg" },
  { title: "Sundried Fruits", image: "https://i.ibb.co/r0B0Shn/sundried.jpg" },
  { title: "Exotic Nuts", image: "https://i.ibb.co/SmfQv7v/exoticnuts.jpg" },
  { title: "Seeds", image: "https://i.ibb.co/v1Z3dRh/seeds.jpg" },
];

const featured = [
  "https://i.ibb.co/2KpXZgM/featured1.jpg",
  "https://i.ibb.co/jTW3s52/featured2.jpg",
  "https://i.ibb.co/R7Wm1xc/featured3.jpg",
];

const products = [
  { name: "Tata Salt", price: 27, image: "https://i.ibb.co/JF5fwz6/tata-salt.jpg" },
  { name: "Fortune Oil", price: 178, image: "https://i.ibb.co/bbKMFbj/mustard.jpg" },
  { name: "Sugar 1kg", price: 52, image: "https://i.ibb.co/C6M1mkm/sugar.jpg" },
];

const events = [
  "https://i.ibb.co/S3WyyDx/event1.jpg",
  "https://i.ibb.co/16DkF0p/event2.jpg",
  "https://i.ibb.co/dtgL3cB/event3.jpg",
];

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  contentWrapper: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "rgba(255, 100, 100, 0.2)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerSub: {
    textAlign: "center",
    color: "#FF3B30",
    fontSize: 13,
  },
  headerMain: {
    textAlign: "center",
    color: "#FF3B30",
    fontSize: 23,
    fontWeight: "700",
    marginBottom: 10,
  },
  searchBox: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  searchInput: { marginLeft: 10, flex: 1 },

  banner: {
    width: 320,
    height: 150,
    borderRadius: 12,
    marginRight: 15,
    marginVertical: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 15,
    marginTop: 10,
  },

  smallCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginRight: 15,
    alignItems: "center",
    width: 100,
  },
  smallImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  smallText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  gridItem: {
    width: "47%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginBottom: 15,
  },
  gridImg: { width: "100%", height: 80, borderRadius: 12 },
  gridText: {
    marginTop: 6,
    fontWeight: "700",
  },

  featureImg: {
    width: 150,
    height: 160,
    borderRadius: 12,
    marginRight: 15,
    marginVertical: 15,
  },

  productCard: {
    backgroundColor: "#fff",
    padding: 10,
    width: 160,
    borderRadius: 12,
    marginRight: 15,
  },
  productImg: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },
  addBtn: {
    borderWidth: 1,
    borderColor: "green",
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  productName: { marginTop: 5, fontWeight: "600" },
  productPrice: { fontWeight: "900", marginTop: 3 },

  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  eventImg: {
    width: "32%",
    height: 160,
    borderRadius: 12,
  },

  bottomTabs: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 20,
    zIndex: 999,
  },
});
