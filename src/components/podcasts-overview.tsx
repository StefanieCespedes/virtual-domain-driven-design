import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { graphql, useStaticQuery } from "gatsby"
import React, { FC, useState } from "react"

import BlueButton from "./core/blue-button"
import Podcast from "./podcast"
import PodcastPlatforms from "./podcast-platforms"

interface Podcast {
  title: string
  level: string
  podcast: string
  tags: string[]
}

interface PodcastsOverviewProps {
  levelFilter: string[]
}

const PodcastsOverview: FC<PodcastsOverviewProps> = ({ levelFilter }) => {
  const [offset, setOffset] = useState(0)
  const pageLimit = 5
  const allPodcasts = useStaticQuery<{
    allContentYaml: { nodes: { sessions: Podcast[] }[] }
  }>(graphql`
    query {
      allContentYaml(
        filter: { sessions: { elemMatch: { title: { ne: null } } } }
      ) {
        nodes {
          sessions {
            title
            level
            podcast
            tags
          }
        }
      }
    }
  `).allContentYaml.nodes[0].sessions.filter(
    (session) => session.podcast != null
  )

  const filteredPodcasts = allPodcasts.filter((podcast) =>
    levelFilter.includes(podcast.level)
  )
  let filteredOffSet = offset
  if (filteredOffSet > filteredPodcasts.length) {
    filteredOffSet = Math.floor(filteredPodcasts.length / pageLimit) * pageLimit
  }

  const currentPodcasts = filteredPodcasts.slice(
    filteredOffSet,
    filteredOffSet + pageLimit
  )
  const leftVisible = filteredOffSet > 0
  const rightVisible = filteredPodcasts.length > filteredOffSet + pageLimit

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="my-6 lg:w-2/3 xl:w-1/2">Podcasts</h2>
      <div>
        <p className="italic text-justify">
          Listen to the VDDD podcast by clicking on one of the platforms below
        </p>
        <PodcastPlatforms />
      </div>
      <div className="flex flex-row justify-center">
        <div className="flex justify-center items-center w-1/20">
          <button
            onClick={() => setOffset(filteredOffSet - pageLimit)}
            className={[
              leftVisible ? "" : "invisible",
              "transition duration-500 text-blue-700 hover:text-blue-400",
            ].join(" ")}
          >
            <FontAwesomeIcon icon={faChevronCircleLeft} size="4x" />
          </button>
        </div>
        <div className="flex flex-row flex-wrap items-center w18/20">
          {currentPodcasts.map((session, index) => {
            return <Podcast key={index} session={session}></Podcast>
          })}
        </div>
        <div className="flex justify-center items-center w-1/20">
          <button
            onClick={() => setOffset(filteredOffSet + pageLimit)}
            className={[
              rightVisible ? "" : "invisible",
              "transition duration-500 text-blue-700 hover:text-blue-400",
            ].join(" ")}
          >
            <FontAwesomeIcon icon={faChevronCircleRight} size="4x" />
          </button>
        </div>
      </div>
      <BlueButton to="/learning-ddd/podcasts">All Podcasts</BlueButton>
    </div>
  )
}

export default PodcastsOverview
