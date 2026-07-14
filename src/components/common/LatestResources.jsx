import { motion } from "framer-motion";


const resources = [
  {
    id: 1,
    type: "📄 Mid Question",
    course: "CSE221",
    uploader: "Farhan",
    rating: 4.8,
    views: 230,
    downloads: 120,
  },
  {
    id: 2,
    type: "📝 Lecture Note",
    course: "CSE321",
    uploader: "Ayesha",
    rating: 4.9,
    views: 310,
    downloads: 210,
  },
  {
    id: 3,
    type: "✅ Solution",
    course: "CSE315",
    uploader: "Rahim",
    rating: 4.7,
    views: 190,
    downloads: 140,
  },
  {
    id: 4,
    type: "🎥 Video Lecture",
    course: "CSE411",
    uploader: "Nusrat",
    rating: 4.9,
    views: 420,
    downloads: 180,
  },
];



function LatestResources() {


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
          📂 Latest Resources
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
          Recently uploaded questions, notes, solutions and learning
          materials from the community.
        </p>



      </div>






      {/* Resource Cards */}


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
        resources.map((resource,index)=>(


          <motion.div


          key={resource.id}


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
          "

          >





            {/* Resource Badge */}


            <span
            className="
            inline-flex
            rounded-full
            border
            border-blue-500/30
            bg-blue-500/20
            px-4
            py-2
            text-sm
            font-semibold
            text-blue-400
            "
            >
              {resource.type}
            </span>







            {/* Course */}


            <h3
            className="
            mt-6
            text-3xl
            font-bold
            text-white
            transition
            group-hover:text-blue-400
            "
            >
              {resource.course}
            </h3>





            {/* Uploader */}


            <p
            className="
            mt-2
            text-slate-400
            "
            >
              👤 Uploaded by {resource.uploader}
            </p>








            {/* Stats */}


            <div
            className="
            mt-6
            space-y-3
            "
            >



              <div
              className="
              flex
              justify-between
              rounded-xl
              bg-slate-800/60
              px-4
              py-3
              "
              >

                <span className="text-slate-400">
                  Rating
                </span>


                <span className="font-semibold text-yellow-400">
                  ⭐ {resource.rating}
                </span>

              </div>






              <div
              className="
              flex
              justify-between
              rounded-xl
              bg-slate-800/60
              px-4
              py-3
              "
              >

                <span className="text-slate-400">
                  Views
                </span>


                <span className="text-white">
                  👁 {resource.views}
                </span>


              </div>






              <div
              className="
              flex
              justify-between
              rounded-xl
              bg-slate-800/60
              px-4
              py-3
              "
              >

                <span className="text-slate-400">
                  Downloads
                </span>


                <span className="text-white">
                  ⬇ {resource.downloads}
                </span>


              </div>




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

              Download Resource ↓

            </motion.button>





          </motion.div>


        ))
      }



      </div>




    </motion.section>

  );

}



export default LatestResources;