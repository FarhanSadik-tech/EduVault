import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../firebase/firebase.config";
import ResourceCard from "./ResourceCard";



function LatestResources() {

const [resources, setResources] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {

  const fetchResources = async () => {

    try {

      const q = query(
        collection(db, "resources"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResources(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  fetchResources();

}, []);
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

{loading ? (

  <p className="col-span-full text-center text-slate-400">
    Loading resources...
  </p>

) : resources.length === 0 ? (

  <p className="col-span-full text-center text-slate-400">
    No resources uploaded yet.
  </p>

) : (

  resources.map((resource) => (

    <motion.div
      key={resource.id}
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      viewport={{
        once: true,
      }}
    >
      <ResourceCard resource={resource} />
    </motion.div>

  ))

)}
      



      </div>




    </motion.section>

  );

}



export default LatestResources;