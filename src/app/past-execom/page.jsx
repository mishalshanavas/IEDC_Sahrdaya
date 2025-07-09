"use client";

import { useEffect, useState } from "react";
import { getPastExecoms, getPastExecomMembersByYear } from "../../utils/FirebaseFunctions";
import styled from "styled-components";
import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/sections/HomePage/FooterSection";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff5733;
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

const SocietySection = styled.div`
  margin-bottom: 40px;
`;

const SocietyTitle = styled.h2`
  margin: 1.6rem 0;
  color: #ff5733;
  border-bottom: 2px solid #ff5733;
  padding-bottom: 10px;
  font-weight: 500;
  font-size: 22px;
  margin-bottom: 20px;
`;

const MembersGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const MemberCard = styled.div`
  width: 200px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  text-align: center;
  &:hover {
    transform: translateY(-5px);
  }
`;

const MemberImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  aspect-ratio: 1;

`;

const MemberInfo = styled.div`
  padding: 15px;
`;

const SelectYearWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    font-size: 1.2rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 10px;
  }

  select {
    background-color: #ff5733;  /* Orange background */
    color: white;
    padding: 8px 16px;
    font-size: 1.1rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    width: 250px;
    font-weight: bold;

    &:focus {
      outline: none;
      background-color: #e34b2f;  /* Darker orange on focus */
    }

    option {
      font-weight: normal;
      padding: 10px;
    }
  }
`;

const PastExecomPage = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024-25"); // Hardcoded default year
  const [members, setMembers] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);
  const [errorYears, setErrorYears] = useState(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [errorMembers, setErrorMembers] = useState(null);

  // Society Priority Order
  const societyPriorityOrder = {
    "Main": 1,
    "Coders Club": 2,
    "Hardware Club": 3,
    // Add more societies if necessary
  };

  const groupMembersBySociety = (members) => {
    const grouped = members.reduce((acc, member) => {
      const society = member.society || "Unspecified"; // Default to 'Unspecified' if no society is provided
      if (!acc[society]) {
        acc[society] = [];
      }
      acc[society].push(member);
      return acc;
    }, {});

    const sortedSocieties = Object.keys(grouped).sort((a, b) => {
      const priorityA = societyPriorityOrder[a] || 100;
      const priorityB = societyPriorityOrder[b] || 100;
      return priorityA - priorityB;
    });

    const sortedGrouped = {};
    sortedSocieties.forEach(society => {
      sortedGrouped[society] = grouped[society];
    });

    return sortedGrouped;
  };

  const handleYearChange = async (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    setLoadingMembers(true);
    setErrorMembers(null);

    try {
      const membersData = await getPastExecomMembersByYear(year);
      setMembers(membersData);
    } catch (error) {
      setErrorMembers(error);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      setLoadingYears(true);
      setErrorYears(null);
      try {
        const yearsData = await getPastExecoms();
        setYears(yearsData);
      } catch (error) {
        setErrorYears(error);
      } finally {
        setLoadingYears(false);
      }
    };

    fetchYears();

    // Fetch members for the default year (2024-25) immediately on load
    const fetchMembersForDefaultYear = async () => {
      setLoadingMembers(true);
      setErrorMembers(null);
      try {
        const membersData = await getPastExecomMembersByYear("2024-25");
        setMembers(membersData);
      } catch (error) {
        setErrorMembers(error);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembersForDefaultYear();
  }, []);

  if (loadingYears) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <Title>Past Execoms</Title>
          <div>Loading years...</div>
        </PageContainer>
        <FooterSection />
      </>
    );
  }

  if (errorYears) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <Title>Past Execoms</Title>
          <div>Error loading years: {errorYears.message}</div>
        </PageContainer>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageContainer>
        <Title>Past Execoms</Title>

        <SelectYearWrapper>
          <label htmlFor="year-select">Select Year:</label>
          <select id="year-select" value={selectedYear} onChange={handleYearChange}>
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </SelectYearWrapper>

        {loadingMembers ? (
          <div>Loading members...</div>
        ) : errorMembers ? (
          <div>Error loading members: {errorMembers.message}</div>
        ) : selectedYear && members.length > 0 ? (
          Object.entries(groupMembersBySociety(members)).map(([society, societyMembers]) => (
            <SocietySection key={society}>
              <SocietyTitle>{society}</SocietyTitle>
              <MembersGrid>
                {societyMembers.map((member) => (
                  <MemberCard key={member.id}>
                    <MemberImage src={member.mediaPath} alt={member.name} />
                    <MemberInfo>
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                    </MemberInfo>
                  </MemberCard>
                ))}
              </MembersGrid>
            </SocietySection>
          ))
        ) : selectedYear && members.length === 0 ? (
          <div>The search for the {selectedYear} members is still continuing. Will be updated when they are found</div>
        ) : null}
      </PageContainer>
      <FooterSection />
    </>
  );
};

export default PastExecomPage;
