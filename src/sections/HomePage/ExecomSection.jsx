import styled from "styled-components";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const ExecomContainer = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  text-align: center;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #f97316;
  margin-bottom: 1rem;
  margin-top: 1rem;

  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.5rem;
  }
`;

const MembersGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: center;

  > * {
    flex-basis: calc(33.333% - 1.333rem);
    max-width: calc(33.333% - 1.333rem);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;

    > * {
      flex-basis: 100%;
      max-width: 100%;
    }
  }
`;

const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MemberImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const MemberName = styled.h2`
  color: #ff6600;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const MemberPosition = styled.p`
  color: #333;
  font-size: 1rem;
`;

const ExecomSection = ({ people, showFullExecomBtn }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <ExecomContainer id="execom">
      <Title>Execom</Title>

      {people.length === 0 ? (
        <>
          <h2 className="text-5xl text-center py-6">🛑 404 NOT FOUND 🛑</h2>
          <h2 className="text-center text-md">
            No Members found. Contact CTO.
          </h2>
        </>
      ) : (
        <MembersGrid>
          {people.map((member, index) => (
            <MemberCard key={index}>
              <MemberImage
                src={member.mediaPath}
                alt={`${member.name}'s photo`}
              />
              <MemberName>{member.name}</MemberName>
              <MemberPosition>{member.role}</MemberPosition>
            </MemberCard>
          ))}
        </MembersGrid>
      )}

      {showFullExecomBtn && (
        <motion.div
          ref={ref} // ✅ Needed for inView detection
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link href="/execom" passHref>
            <motion.button
              className="px-12 py-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              View Full Execom
            </motion.button>
          </Link>
        </motion.div>
      )}
    </ExecomContainer>
  );
};

export default ExecomSection;