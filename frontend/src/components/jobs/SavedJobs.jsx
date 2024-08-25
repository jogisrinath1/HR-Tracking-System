import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "./Card";
import { UserSidebar } from "../userDashboard/UserSidebar";

export function SavedJobs() {
    const { savedJobs } = useSelector((state) => state.user);
    console.log(savedJobs);
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
        const fetchJobs = async () => {
            const requests = savedJobs.map((jobId) => {
                return axios.get(`/api/jobs/${jobId}`);
            });

            const results = await axios.all(requests);
            const jobs = results.map((res) => res.data);

            setJobs(jobs);
        };

        fetchJobs();
    }, []);

    return (
        <div className="tw-flex tw-flex-wrap tw-gap-10">
            <UserSidebar />
            <div className="tw-mt-5 tw-w-3/4">
                <h1>Saved Jobs</h1>
                <div className="tw-flex tw-flex-wrap tw-gap-10">
                    {jobs.map((job) => {
                        return <Card key={job._id} job={job} />;
                    })}
                </div>
            </div>
        </div>
    );
}
