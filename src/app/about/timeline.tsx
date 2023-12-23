"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

export default function DataSocTimeline() {
  return (
    <VerticalTimeline animate={false} lineColor="#D3D3D3">
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentArrowStyle={{
          borderRight: "7px solid  rgb(33, 150, 243)",
        }}
        visible={true}
        icon={<></>}
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
      >
        <h3 className="vertical-timeline-element-title text-2xl font-semibold">
          April, 2017
        </h3>
        <p>
          DataSoc was founded along side its very first iteration of the
          official website!
        </p>
      </VerticalTimelineElement>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentArrowStyle={{
          borderRight: "7px solid  rgb(33, 150, 243)",
        }}
        visible={true}
        icon={<></>}
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
      >
        <h3 className="vertical-timeline-element-title text-2xl font-semibold">
          May, 2017
        </h3>
        <p>
          DataSoc announces and hosts its first ever event: Meet the
          representatives of Tableau Software, and get to know the power of
          Tableau in AI and modern data science.
        </p>
      </VerticalTimelineElement>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentArrowStyle={{
          borderRight: "7px solid  rgb(33, 150, 243)",
        }}
        visible={true}
        icon={<></>}
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
      >
        <h3 className="vertical-timeline-element-title text-2xl font-semibold">
          June, 2017
        </h3>
        <p>
          DataSoc hosts its first ever networking night with Alibaba, Suncorp,
          Bupa, and many more.
        </p>
      </VerticalTimelineElement>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentArrowStyle={{
          borderRight: "7px solid  rgb(33, 150, 243)",
        }}
        visible={true}
        icon={<></>}
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
      >
        <h3 className="vertical-timeline-element-title text-2xl font-semibold">
          March, 2018
        </h3>
        <p>
          DataSoc celebrates 1000 likes and 1000+ follows on Facebook! This
          month also marks the beginning of DataSoc&apos;s Weekly Data
          Discoveries tradition that continues to this day in our newsletters!
        </p>
      </VerticalTimelineElement>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentArrowStyle={{
          borderRight: "7px solid  rgb(33, 150, 243)",
        }}
        visible={true}
        icon={<></>}
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
      >
        <h3 className="vertical-timeline-element-title text-2xl font-semibold">
          September, 2019
        </h3>
        <p>
          As we celebrate 2000 likes on Facebook, we hosted our first ever
          international datathon in conjunction with Tsinghua University&apos;s
          Institute of Data Science!
        </p>
      </VerticalTimelineElement>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentArrowStyle={{
          borderRight: "7px solid  rgb(33, 150, 243)",
        }}
        visible={true}
        icon={<></>}
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
      >
        <h3 className="vertical-timeline-element-title text-2xl font-semibold">
          March, 2020
        </h3>
        <p>
          DataSoc&apos;s website undergoes a modern transformation as we double
          our subcommitee team.
        </p>
      </VerticalTimelineElement>
    </VerticalTimeline>
  );
}
