// import { useState, useEffect } from 'react';
//
// export default function CountryExplorerHero() {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({
//         x: e.clientX / window.innerWidth,
//         y: e.clientY / window.innerHeight
//       });
//     };
//
//     window.addEventListener('mousemove', handleMouseMove);
//
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);
//
//   const handleScrollClick = () => {
//     window.scrollTo({
//       top: window.innerHeight,
//       behavior: 'smooth'
//     });
//   };
//
//   const handleSearchClick = (e) => {
//     // In a real app, you would handle the search functionality here
//     console.log("Search clicked");
//   };
//
//   return (
//     <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-red-800 to-yellow-500 bg-[length:300%_300%] animate-gradient">
//       <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
//         {floatingIcons.map((icon, index) => (
//           <FloatingIcon
//             key={index}
//             path={icon.path}
//             style={{
//               top: icon.top,
//               left: icon.left,
//               width: icon.width,
//               animationDuration: icon.duration,
//               animationDelay: icon.delay,
//               transform: `translate(
//                 ${(mousePosition.x - 0.5) * parseFloat(icon.width) / 50 * 40}px,
//                 ${(mousePosition.y - 0.5) * parseFloat(icon.width) / 50 * 40}px
//               )`
//             }}
//           />
//         ))}
//       </div>
//
//       <div className="max-w-6xl w-11/12 flex flex-col  text-white z-10">
//         <h1 className="absolute text-5xl border-2 border-amber-400 font-extrabold mb-4 animate-fadeInUp text-shadow">
//           Explore the World
//         </h1>
//         <p className="text-2xl mb-8 max-w-2xl animate-fadeInUp animation-delay-300">
//           Discover amazing cultures, breathtaking landscapes, and unforgettable experiences from around the globe.
//         </p>
//
//         <div className="relative w-full max-w-xl animate-fadeInUp animation-delay-600 mb-12">
//           <input
//             type="text"
//             className="w-full py-4 px-6 rounded-full border-none text-lg shadow-lg transition-all duration-300
//             focus:outline-none focus:shadow-white"
//             placeholder="Search for a country..."
//           />
//           <button
//             onClick={handleSearchClick}
//             className="absolute right-1 top-1 h-[calc(100%-8px)] px-6 border-none bg-gradient-to-r
//             from-blue-500 to-blue-700 text-white rounded-full cursor-pointer transition-all
//             duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-500"
//           >
//             Explore
//           </button>
//         </div>
//
//         <div className="flex gap-6 justify-center flex-wrap animate-fadeInUp animation-delay-900">
//           {countries.map((country, index) => (
//             <CountryCard key={index} name={country} />
//           ))}
//         </div>
//       </div>
//
//       <div
//         className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-10"
//         onClick={handleScrollClick}
//       >
//         <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
//           <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
//         </svg>
//       </div>
//
//       <style jsx global>{`
//         @keyframes gradientBG {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//
//         @keyframes fadeInUp {
//           to {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }
//
//         @keyframes float {
//           0% {
//             transform: translateY(0) rotate(0deg);
//             opacity: 0;
//           }
//           10% {
//             opacity: 0.15;
//           }
//           90% {
//             opacity: 0.15;
//           }
//           100% {
//             transform: translateY(-1000px) rotate(360deg);
//             opacity: 0;
//           }
//         }
//
//         .animate-gradient {
//           animation: gradientBG 15s ease infinite;
//         }
//
//         .animate-fadeInUp {
//           transform: translateY(20px);
//           opacity: 0;
//           animation: fadeInUp 1s ease forwards;
//         }
//
//         .animation-delay-300 {
//           animation-delay: 0.3s;
//         }
//
//         .animation-delay-600 {
//           animation-delay: 0.6s;
//         }
//
//         .animation-delay-900 {
//           animation-delay: 0.9s;
//         }
//
//         .text-shadow {
//           text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
//         }
//
//         .focus\:shadow-white:focus {
//           box-shadow: 0 5px 25px rgba(255, 255, 255, 0.4);
//         }
//       `}</style>
//     </div>
//   );
// }
//
// function CountryCard({ name }) {
//   return (
//     <div className="w-28 h-28 rounded-2xl overflow-hidden relative cursor-pointer transition-all duration-400 shadow-lg hover:transform hover:-translate-y-2 hover:shadow-xl group">
//       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-70 z-10"></div>
//       <img
//         src={`/api/placeholder/120/120`}
//         alt={name}
//         className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-110"
//       />
//       <div className="absolute bottom-2 left-2 text-white font-semibold text-sm z-20">
//         {name}
//       </div>
//     </div>
//   );
// }
//
// function FloatingIcon({ path, style }) {
//   return (
//     <svg
//       className="absolute opacity-15 animate-float"
//       style={style}
//       viewBox="0 0 24 24"
//     >
//       <path d={path} />
//     </svg>
//   );
// }
//
// // Data
// const countries = ["Japan", "Italy", "Brazil", "Kenya", "Iceland"];
//
// const floatingIcons = [
//   {
//     path: "M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 " +
//         "14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z",
//     top: "20%",
//     left: "10%",
//     width: "50px",
//     duration: "25s",
//     delay: "0s"
//   },
//   {
//     path: "M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 " +
//         "11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11," +
//         "19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10" +
//         " 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
//     top: "70%",
//     left: "80%",
//     width: "40px",
//     duration: "20s",
//     delay: "2s"
//   },
//   {
//     path: "M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25" +
//         " 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75M12,15C13.5,15 16.5,15.75 16.5,17.25V18H7.5V17.25C7.5,15.75" +
//         " 10.5,15 12,15Z",
//     top: "30%",
//     left: "85%",
//     width: "60px",
//     duration: "18s",
//     delay: "1s"
//   },
//   {
//     path: "M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0" +
//         " 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,12.5A1.5,1.5 0 0,1 " +
//         "10.5,11A1.5,1.5 0 0,1 12,9.5A1.5,1.5 0 0,1 13.5,11A1.5,1.5 0 0,1 12,12.5M12,7.2C9.9,7.2" +
//         " 8.2,8.9 8.2,11C8.2,14 12,17.5 12,17.5C12,17.5 15.8,14 15.8,11C15.8,8.9 14.1,7.2 12,7.2Z",
//     top: "50%",
//     left: "15%",
//     width: "45px",
//     duration: "22s",
//     delay: "3s"
//   }
// ];