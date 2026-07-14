import { motion } from "framer-motion";

import {
  Search,
  FolderOpen,
  Upload,
  LayoutDashboard,
  BookOpen,
  FileText,
  FileCheck,
  Video,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";


function HeroSection() {


  return (

    <motion.section

      initial={{
        opacity:0,
        y:40
      }}

      animate={{
        opacity:1,
        y:0
      }}

      transition={{
        duration:0.8
      }}

      className="
      relative
      overflow-hidden
      rounded-3xl
      bg-gradient-to-br
      from-slate-950
      via-slate-900
      to-blue-950
      px-8
      py-20
      text-white
      shadow-2xl
      "

    >




      {/* Glow Background */}


      <div
      className="
      absolute
      -left-20
      top-10
      h-72
      w-72
      rounded-full
      bg-blue-600/20
      blur-3xl
      "
      />


      <div
      className="
      absolute
      right-0
      bottom-0
      h-80
      w-80
      rounded-full
      bg-cyan-500/10
      blur-3xl
      "
      />






      <div
      className="
      relative
      z-10
      grid
      items-center
      gap-14
      lg:grid-cols-2
      "
      >






        {/* LEFT SIDE */}


        <div>



          <motion.span

          initial={{
            opacity:0,
            y:20
          }}

          animate={{
            opacity:1,
            y:0
          }}

          transition={{
            delay:0.2
          }}

          className="
          inline-block
          rounded-full
          border
          border-blue-500/40
          bg-blue-500/10
          px-4
          py-2
          text-sm
          font-medium
          text-blue-300
          "

          >

            Welcome to EduVault

          </motion.span>








          <motion.h1

          initial={{
            opacity:0,
            x:-30
          }}

          animate={{
            opacity:1,
            x:0
          }}

          transition={{
            delay:0.3
          }}

          className="
          mt-8
          text-5xl
          font-extrabold
          leading-tight
          tracking-tight
          lg:text-6xl
          "

          >

            Learn Smarter.
            <br />

            <span
            className="
            bg-gradient-to-r
            from-blue-400
            to-cyan-400
            bg-clip-text
            text-transparent
            "
            >
              Share Better.
            </span>

            <br />

            Grow Together.

          </motion.h1>








          <p
          className="
          mt-7
          max-w-xl
          text-lg
          leading-8
          text-slate-400
          "
          >

            Access previous questions, lecture notes,
            solutions, video lectures and collaborate
            with your classmates from one modern
            academic platform.

          </p>








        {/* Search */}

<div
  className="
    relative
    mt-10
    flex
    overflow-hidden
    rounded-2xl
    border
    border-slate-700
    bg-slate-900
    shadow-xl
  "
>
  {/* Search Icon */}

  <Search
    size={20}
    className="
      absolute
      left-5
      top-1/2
      -translate-y-1/2
      text-slate-400
    "
  />

  {/* Input */}

  <input
    type="text"
    placeholder="Search course, topic or faculty..."
    className="
      w-full
      bg-transparent
      py-4
      pl-14
      pr-4
      text-white
      outline-none
      placeholder:text-slate-400
    "
  />

  {/* Search Button */}

  <button
    className="
      primary-btn
      rounded-none
    "
  >
    Search
  </button>
</div>

          {/* CTA Buttons */}



          <div
          className="
          mt-8
          flex
          flex-wrap
          gap-4
          "
          >


            <motion.button

            whileHover={{
              scale:1.05
            }}

            whileTap={{
              scale:0.95
            }}

            className="
            primary-btn
            flex
            items-center
            gap-2
            "

            >

              <FolderOpen size={20}/>

              Explore Resources

            </motion.button>





            <motion.button

            whileHover={{
              scale:1.05
            }}

            whileTap={{
              scale:0.95
            }}

            className="
            secondary-btn
            flex
            items-center
            gap-2
            "

            >

              <Upload size={20}/>

              Upload Resource

            </motion.button>


          </div>


        </div>









        {/* RIGHT DASHBOARD */}



        <motion.div


        animate={{
          y:[0,-10,0]
        }}


        transition={{
          duration:4,
          repeat:Infinity
        }}



        className="
        relative
        "

        >



          <div
          className="
          absolute
          inset-0
          rounded-3xl
          bg-blue-500/20
          blur-3xl
          "
          />




          <div

          className="
          relative
          rounded-3xl
          border
          border-slate-700
          bg-slate-900/80
          p-8
          backdrop-blur-xl
          shadow-2xl
          "

          >



            <h2
            className="
            flex
            items-center
            gap-2
            text-2xl
            font-bold
            "
            >

              <LayoutDashboard
              className="text-blue-400"
              />

              Dashboard

            </h2>





            <div className="mt-8 space-y-5">


              {[
                ["Notes",125,BookOpen,"text-blue-400"],
                ["Questions",86,FileText,"text-cyan-400"],
                ["Solutions",59,FileCheck,"text-green-400"],
                ["Videos",42,Video,"text-red-400"],
              ].map(([title,value,Icon,color])=>(


                <div
                key={title}
                className="
                flex
                justify-between
                rounded-xl
                bg-slate-800/60
                px-4
                py-3
                "
                >


                  <div className="flex items-center gap-3 text-slate-300">

                    <Icon size={18} className={color}/>

                    {title}

                  </div>


                  <span className="font-bold text-blue-400">

                    {value}

                  </span>


                </div>


              ))}


            </div>






            <div
            className="
            mt-6
            flex
            items-center
            justify-between
            rounded-xl
            bg-green-500/10
            p-4
            "
            >

              <div>

                <p className="text-slate-400">
                  Online Users
                </p>


                <h3 className="text-3xl font-bold text-green-400">
                  247
                </h3>

              </div>


              <Users
              size={35}
              className="text-green-400"
              />


            </div>






            <div className="my-8 border-t border-slate-700"/>




            <h3
            className="
            flex
            items-center
            gap-2
            font-bold
            "
            >

              <TrendingUp className="text-orange-400"/>

              Trending Course

            </h3>



            <p className="mt-2 text-slate-300">

              CSE221 — Data Structures

            </p>





            <motion.button

            whileHover={{
              scale:1.05
            }}

            whileTap={{
              scale:0.95
            }}

            className="
            primary-btn
            mt-8
            flex
            w-full
            items-center
            justify-center
            gap-2
            "
            >

              Open Course

              <ArrowRight size={18}/>

            </motion.button>



          </div>


        </motion.div>




      </div>


    </motion.section>


  );

}


export default HeroSection;