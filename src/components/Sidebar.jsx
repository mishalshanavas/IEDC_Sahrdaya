"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

const SidebarContainer = styled.div`
  width: 220px;
  height: 100vh;
  background: linear-gradient(to bottom, #fffaf0, #fef9c3);
  border-right: 2px solid #facc15;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow: hidden;
  position: sticky;  /* Sticky Sidebar */
  top: 0;  /* Keep the sidebar at the top */
  z-index: 10;  /* Ensure sidebar stays above content while scrolling */

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    flex-direction: row;
    border-right: none;
    border-bottom: 2px solid #facc15;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f97316;
  background: linear-gradient(to right, #f97316, #facc15);
  color: white;
  text-align: center;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TabList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const Tab = styled.div`
  margin: 5px 10px;
  border-radius: 10px;
  overflow: hidden;
  background-color: ${(props) => (props.active === "true" ? "#f97316" : "transparent")};
  box-shadow: ${(props) => (props.active === "true" ? "0 2px 5px rgba(0,0,0,0.1)" : "none")};
  transition: background-color 0.3s, transform 0.1s;

  &:hover {
    background-color: ${(props) => (props.active === "true" ? "#fb923c" : "#fff7ed")};
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    flex: 1;
    margin: 0;
    border-radius: 0;
  }
`;

const StyledLink = styled(Link)`
  display: block;
  padding: 15px 20px;
  font-weight: 600;
  color: ${(props) => (props.active === "true" ? "white" : "#333")};
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: ${(props) => (props.active === "true" ? "white" : "#f97316")};
  }

  @media (max-width: 768px) {
    text-align: center;
    padding: 12px 10px;
  }
`;

const Sidebar = ({ society }) => {
  const pathname = usePathname();
  const sidebarLinks = [
    { href: "/dashboard/execom", label: "Execom" },

    ...(society && society.toLowerCase() !== "main" ? [{ href: "/dashboard/club", label: "Club Page Data" }] : []),
    ...(society && society.toLowerCase() == "main" ? [{ href: "/dashboard/upcoming", label: "Upcoming Events" }] : []),
    ...(society && society.toLowerCase() == "main" ? [    { href: "/dashboard/past-execom", label: "Past Execom" },] : []),
    { href: "/dashboard", label: "Events" },
    { href: "/dashboard/gallery", label: "Gallery" },
  ];

  return (
    <SidebarContainer>
      <SidebarHeader>
        {society ? society.toUpperCase() : ''}
      </SidebarHeader>
      <TabList>
        {sidebarLinks.map((link, index) => (
          <Tab key={index} active={`${pathname === link.href}`}>
            <StyledLink href={link.href} active={`${pathname === link.href}`}>
              {link.label}
            </StyledLink>
          </Tab>
        ))}
      </TabList>
    </SidebarContainer>
  );
};

export default Sidebar;
