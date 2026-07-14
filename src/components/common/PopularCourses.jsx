import { motion } from "framer-motion";


const courses = [
  {
    id: 1,
    code: "CSE221",
    name: "Data Structures",
    faculty: "Dr. John Doe",
    rating: 4.8,
    questions: 25,
    notes: 40,
  },
  {
    id: 2,
    code: "CSE315",
    name: "Database Systems",
    faculty: "Dr. Sarah Ahmed",
    rating: 4.9,
    questions: 30,
    notes: 55,
  },
  {
    id: 3,
    code: "CSE321",
    name: "Operating Systems",
    faculty: "Prof. Tanvir Hasan",
    rating: 4.7,
    questions: 20,
    notes: 35,
  },
  {
    id: 4,
    code: "CSE411",
    name: "Artificial Intelligence",
    faculty: "Dr. Emily Watson",
    rating: 4.9,
    questions: 18,
    notes: 28,
  },
];



function PopularCourses() {

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
          🔥 Popular Courses
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
          Explore top-rated courses with organized questions,
          notes, solutions and learning resources.
        </p>


      </div>





      {/* Cards */}

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
        courses.map((course,index)=>(


          <motion.div


          key={course.id}


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




            {/* Badges */}


            <div
            className="
            flex
            flex-wrap
            gap-2
            "
            >


              <span
              className="
              rounded-full
              border
              border-blue-500/30
              bg-blue-500/20
              px-3
              py-1
              text-xs
              font-semibold
              text-blue-400
              "
              >
                {course.code}
              </span>



              <span
              className="
              rounded-full
              border
              border-purple-500/30
              bg-purple-500/20
              px-3
              py-1
              text-xs
              font-semibold
              text-purple-400
              "
              >
                CSE Faculty
              </span>


            </div>







            {/* Course Title */}


            <h3
            className="
            mt-5
            text-2xl
            font-bold
            text-white
            transition
            group-hover:text-blue-400
            "
            >
              {course.name}
            </h3>





            {/* Faculty */}


            <p
            className="
            mt-3
            text-slate-400
            "
            >
              👨‍🏫 {course.faculty}
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
                  ⭐ {course.rating}
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
                  Questions
                </span>


                <span className="text-white">
                  📄 {course.questions}
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
                  Notes
                </span>


                <span className="text-white">
                  📝 {course.notes}
                </span>


              </div>



            </div>







            {/* Buttons */}


            <div
            className="
            mt-8
            flex
            gap-3
            "
            >


              <motion.button

              whileHover={{
                scale:1.08
              }}

              whileTap={{
                scale:0.95
              }}

              className="
              secondary-btn
              px-4
              text-xl
              "
              >

                ❤️

              </motion.button>





              <motion.button

              whileHover={{
                scale:1.05
              }}

              whileTap={{
                scale:0.95
              }}

              className="
              primary-btn
              flex-1
              "
              >

                Open Course →

              </motion.button>



            </div>




          </motion.div>


        ))
      }



      </div>



    </motion.section>

  );
}



export default PopularCourses;