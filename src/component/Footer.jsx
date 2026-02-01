import React from "react";

const year = new Date().getFullYear();


const Footer = () => {
  return <div> 
    <footer>
  <p>&copy;{year}</p>
  </footer> 
</div>
}

export default Footer;

//4. Create a Footer.jsx component that renders a <footer> element
//to show a copyright message in a <p> with a dynamically updated year.