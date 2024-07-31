import React from "react";
import Navbar from "../Components/Navbar";
import Carousel from "../Components/Carousel";
import Cards from "../Components/Cards";
import Footer from "../Components/Footer";

function Home() {
    return (
        <>
            <Navbar />
            <Carousel />
            <Cards />
            <Footer />
          </>
    );
}

export default Home;