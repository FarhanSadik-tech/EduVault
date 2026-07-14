import { motion } from "framer-motion";


const contributors = [
  {
    id: 1,
    rank: "🥇",
    name: "Farhan Sadik",
    reputation: 1250,
    uploads: 58,
  },
  {
    id: 2,
    rank: "🥈",
    name: "Ayesha Rahman",
    reputation: 1120,
    uploads: 46,
  },
  {
    id: 3,
    rank: "🥉",
    name: "Tanvir Hasan",
    reputation: 980,
    uploads: 39,
  },
  {
    id: 4,
    rank: "🏅",
    name: "Nusrat Jahan",
    reputation: 905,
    uploads: 35,
  },
];



function TopContributors() {


  return (

    <motion.section

      initial={{
        opacity:0,
        y:40
      }}

      whileInView={{
        opacity:1,
        y:0
      }}

      transition={{
        duration:0.7
      }}

      viewport={{
        once:true
      }}

      className="mt-24"

    >




      {/* Heading */}


      <div className="text-center">


        <h2
        className="
        text-4xl
        font-bold
        text-white
        "
        >
          🏆 Top Contributors
        </h2>



        <p
        className="
        mx-auto
        mt-4
        max-w-2xl
        text-lg
        text-slate-400
        "
        >
          Students who actively contribute quality academic resources
          to help the learning community.
        </p>


      </div>








      {/* Contributor Cards */}



      <div
      className="
      mt-14
      grid
      gap-8
      md:grid-cols-2
      xl:grid-cols-4
      "
      >


      {
        contributors.map((student,index)=>(


          <motion.div


          key={student.id}



          initial={{
            opacity:0,
            y:50
          }}



          whileInView={{
            opacity:1,
            y:0
          }}



          transition={{
            duration:0.5,
            delay:index*0.15
          }}



          whileHover={{
            y:-12,
            scale:1.03
          }}



          viewport={{
            once:true
          }}



          className="
          card-style
          group
          p-7
          text-center
          "

          >





            {/* Rank Badge */}


            <motion.div

            whileHover={{
              scale:1.15,
              rotate:5
            }}

            className="
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            bg-slate-800
            text-5xl
            shadow-lg
            "

            >

              {student.rank}

            </motion.div>









            {/* Name */}


            <h3

            className="
            mt-6
            text-2xl
            font-bold
            text-white
            transition
            group-hover:text-blue-400
            "

            >

              {student.name}

            </h3>









            {/* Reputation */}


            <div
            className="
            mt-8
            rounded-2xl
            bg-blue-500/10
            p-5
            border
            border-blue-500/20
            "
            >


              <p
              className="
              text-sm
              text-slate-400
              "
              >
                ⭐ Reputation
              </p>



              <p
              className="
              mt-2
              text-4xl
              font-bold
              text-blue-400
              "
              >

                {student.reputation}

              </p>


            </div>









            {/* Upload Stats */}


            <div

            className="
            mt-5
            rounded-2xl
            bg-green-500/10
            p-5
            border
            border-green-500/20
            "

            >


              <p
              className="
              text-sm
              text-slate-400
              "
              >

                📄 Uploaded Resources

              </p>



              <p
              className="
              mt-2
              text-3xl
              font-bold
              text-green-400
              "
              >

                {student.uploads}

              </p>



            </div>









            {/* Button */}


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
            w-full
            "

            >

              View Profile →

            </motion.button>





          </motion.div>


        ))
      }



      </div>




    </motion.section>

  );

}



export default TopContributors;