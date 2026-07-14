import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

import {
  House,
  Building2,
  BookOpen,
  MessageCircle,
  Upload,
} from "lucide-react";



function Navbar() {


  const navItems = [
    {
      name:"Home",
      path:"/",
      icon:House
    },
    {
      name:"Departments",
      path:"/department",
      icon:Building2
    },
    {
      name:"Courses",
      path:"/course",
      icon:BookOpen
    },
    {
      name:"Discussion",
      path:"/discussion",
      icon:MessageCircle
    },
    {
      name:"Upload",
      path:"/upload",
      icon:Upload
    },
  ];




  return (

    <motion.header


      initial={{
        y:-80,
        opacity:0
      }}


      animate={{
        y:0,
        opacity:1
      }}


      transition={{
        duration:0.6
      }}



      className="
      sticky
      top-0
      z-50
      border-b
      border-slate-800/70
      bg-slate-950/70
      backdrop-blur-xl
      shadow-lg
      "


    >



      <div
      className="
      mx-auto
      flex
      max-w-7xl
      items-center
      justify-between
      px-6
      py-4
      "
      >





        {/* Logo */}



        <NavLink
        to="/"
        className="
        text-3xl
        font-extrabold
        tracking-wide
        transition
        hover:scale-105
        "
        >


          <span className="text-white">
            Edu
          </span>

          <span
          className="
          bg-gradient-to-r
          from-blue-400
          to-cyan-400
          bg-clip-text
          text-transparent
          "
          >
            Vault
          </span>


        </NavLink>








        {/* Navigation */}



        <nav
        className="
        hidden
        items-center
        gap-8
        md:flex
        "
        >



        {
          navItems.map((item)=>(


            <NavLink

            key={item.name}

            to={item.path}

            className={({isActive})=>

              `
              group
              relative
              flex
              items-center
              gap-2
              text-sm
              font-medium
              transition-all
              duration-300

              ${
                isActive
                ?
                "text-blue-400"
                :
                "text-slate-300 hover:text-blue-400"
              }

              `
            }

            >


              <item.icon
              size={18}
              className="
              transition
              group-hover:scale-110
              "
              />

              {item.name}



              {/* Active Line */}

              <span
              className="
              absolute
              -bottom-2
              left-0
              h-[2px]
              w-full
              origin-left
              scale-x-0
              bg-blue-400
              transition-transform
              duration-300
              group-hover:scale-x-100
              "
              />



            </NavLink>


          ))
        }



        </nav>








        {/* Buttons */}



        <div
        className="
        hidden
        items-center
        gap-4
        md:flex
        "
        >



          <motion.div

          whileHover={{
            scale:1.05
          }}

          whileTap={{
            scale:0.95
          }}

          >

            <NavLink

            to="/login"

            className="
            secondary-btn
            px-5
            py-2
            "

            >

              Login

            </NavLink>


          </motion.div>







          <motion.div

          whileHover={{
            scale:1.05
          }}

          whileTap={{
            scale:0.95
          }}

          >


            <NavLink

            to="/register"

            className="
            primary-btn
            px-5
            py-2
            "

            >

              Register

            </NavLink>


          </motion.div>




        </div>






      </div>


    </motion.header>


  );

}


export default Navbar;