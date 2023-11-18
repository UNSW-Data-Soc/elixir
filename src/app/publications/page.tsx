import LinkButton from "../components/LinkButton";
import { NEWSLETTER_ARCHIVE_LINK } from "../utils";

export default function Publications() {
    return (
        <main className="bg-white">
            <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
                <h1 className="text-3xl font-semibold">Publications</h1>
                <p>
                    You can find all of our publications here, including our
                    newsletters and guides!
                </p>
            </header>
            <div className="m-6 p-3 flex items-center justify-center align-baseline gap-12 flex-wrap">
                <LinkButton
                    to="/contact"
                    text="Newsletter Signup"
                    className="w-64 p-3 font-bold text-1xl text-black bg-orange-400"
                />
                <LinkButton
                    to={NEWSLETTER_ARCHIVE_LINK}
                    text="Newsletter Archive"
                    className="w-64 p-3 font-bold text-1xl text-black bg-orange-400"
                />
                <LinkButton
                    to="/blogs"
                    text="Blog"
                    className="w-64 p-3 font-bold text-1xl text-black bg-orange-400"
                />
            </div>
            <div className="m-3 p-3 flex items-stretch justify-center align-baseline gap-12 flex-wrap">
                <div className="m-5 w-96 p-3 flex flex-col justify-between text-center outline outline-1">
                    <p className="text-3xl font-bold">2021 First Year Guide</p>
                    <br></br>
                    <p>
                        UNSW has a whole host of different experiences and
                        opportunities, so much so that it can feel super
                        daunting and confusing.
                    </p>
                    <br />
                    <p>
                        If this is how you feel (and even if it&apos;s not) -
                        this First Year Guide is for you!
                    </p>
                    <br />
                    <LinkButton
                        to="/first-year-guide"
                        text="View First Year Guide"
                        className="w-full p-3"
                    />
                </div>
                <div className="m-5 w-96 p-3 flex-col justify-between text-center outline outline-1">
                    <p className="text-3xl font-bold">2021 Careers Guide</p>
                    <br></br>
                    <p>
                        Data Science can be difficult to navigate career-wise.
                    </p>
                    <br />
                    <p>
                        If you&apos;re looking for a place to start, some extra
                        information, and some guidance from experienced
                        professionals, check out our Careers Guide!
                    </p>
                    <br />
                    <LinkButton
                        to="/careers-guide"
                        text="View Careers Guide"
                        className="w-full p-3"
                    />
                </div>
            </div>
        </main>
    );
}
