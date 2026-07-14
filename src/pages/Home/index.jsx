import { motion } from "framer-motion";

import HeroSection from "../../components/common/HeroSection";
import StatsSection from "../../components/common/StatsSection";
import DepartmentSection from "../../components/common/DepartmentSection";
import PopularCourses from "../../components/common/PopularCourses";
import LatestResources from "../../components/common/LatestResources";
import TopContributors from "../../components/common/TopContributors";


const sectionAnimation = {
  initial: {
    opacity: 0,
    y: 50,
  },

  whileInView: {
    opacity: 1,
    y: 0,
  },

  transition: {
    duration: 0.7,
  },

  viewport: {
    once: true,
    amount: 0.2,
  },
};



function Home() {

  return (

    <main className="overflow-hidden">


      <motion.div {...sectionAnimation}>
        <HeroSection />
      </motion.div>



      <motion.div {...sectionAnimation}>
        <StatsSection />
      </motion.div>



      <motion.div {...sectionAnimation}>
        <DepartmentSection />
      </motion.div>



      <motion.div {...sectionAnimation}>
        <PopularCourses />
      </motion.div>



      <motion.div {...sectionAnimation}>
        <LatestResources />
      </motion.div>



      <motion.div {...sectionAnimation}>
        <TopContributors />
      </motion.div>



    </main>

  );

}


export default Home;