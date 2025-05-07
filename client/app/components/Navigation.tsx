// import { Link, useLocation } from "react-router";

// export default function Navigation() {
//   const location = useLocation();
  
//   return (
//     <nav className="bg-white dark:bg-gray-800 shadow">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/" className="text-xl font-bold">
//               Polkadot POS
//             </Link>
//           </div>
          
//           <div className="flex space-x-4">
//             <Link 
//               to="/" 
//               className={`px-3 py-2 rounded-md ${
//                 location.pathname === "/" 
//                   ? "bg-blue-600 text-white" 
//                   : "text-gray-800 dark:text-gray-200"
//               }`}
//             >
//               Home
//             </Link>
//             <Link 
//               to="/pos" 
//               className={`px-3 py-2 rounded-md ${
//                 location.pathname === "/pos" 
//                   ? "bg-blue-600 text-white" 
//                   : "text-gray-800 dark:text-gray-200"
//               }`}
//             >
//               Point of Sale
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// } 