import { GetServerSideProps } from 'next';
import fs from 'fs';
import path from 'path';
import styles from '../styles/Dataset.module.scss';
import { JobSeeker } from '../types';
import { countByColumn, countByConditions } from '../utils';
import DataTable from '../components/DataTable';
import React, { useState } from 'react';

interface Props {
  data: JobSeeker[];
}

const DataSetPage = ({ data }: Props) => {
  const now = new Date();

  // Helper function to calculate expired WE12_END_DATE (older than 3 months)
  const calculateWFDExpired = (item: JobSeeker) => {
    const we12EndDate = new Date(item.WE12_END_DATE);
    const diffInMonths = (now.getFullYear() - we12EndDate.getFullYear()) * 12 + (now.getMonth() - we12EndDate.getMonth());
    return diffInMonths > 3;
  };

  // Filter data for Kliea and Sylvanas
  const klieaData = data.filter(item => item.MANAGED_BY === 'FHTGKL52');
  const sylvanasData = data.filter(item => item.MANAGED_BY === 'VXJFZS75');

  // Function to calculate stats for given data
  const calculateStats = (data: JobSeeker[]) => {
    const commenced = countByColumn(data, 'STATUS', 'COM');
    const pending = countByColumn(data, 'STATUS', 'PND');
    const suspended = countByColumn(data, 'STATUS', 'SUS');
    const totalCaseload = commenced + pending + suspended;

    const comWfdCoded = countByConditions(data, [['STATUS', 'COM'], ['IN_WFD_ACTIVITY_FLAG', 'Y']]);
    const pndWfdCoded = countByConditions(data, [['STATUS', 'PND'], ['IN_WFD_ACTIVITY_FLAG', 'Y']]);
    const susWfdCoded = countByConditions(data, [['STATUS', 'SUS'], ['IN_WFD_ACTIVITY_FLAG', 'Y']]);
    const wfdExpired = data.filter(item => calculateWFDExpired(item) && item.STATUS === 'COM').length;
    const comWfdNotCoded = countByConditions(data, [['STATUS', 'COM'], ['IN_WFD_ACTIVITY_FLAG', 'N']]);
    const susWfdNotCoded = countByConditions(data, [['STATUS', 'SUS'], ['IN_WFD_ACTIVITY_FLAG', 'N']]);

    const jpNotApproved = countByConditions(data, [['STATUS', 'COM'], ['JOB_PLAN_STATUS', '!=', 'A']]);
    const ai12Required = countByConditions(data, [['STATUS', 'COM'], ['AI12', '!=', 'C']]);
    const js09Required = countByConditions(data, [['STATUS', 'COM'], ['JS09_TYPE', '!=', ['C', 'V']]]);
    const js10Required = countByConditions(data, [['STATUS', 'COM'], ['JS10', '!=', 'C']]);
    const as05Required = countByConditions(data, [['STATUS', 'COM'], ['AS05', '!=', 'Y']]);
    const as11Required = countByConditions(data, [['STATUS', 'COM'], ['AS11', '!=', 'Y']]);
    const as15Required = countByConditions(data, [['STATUS', 'COM'], ['AS15', '!=', 'Y']]);
    const as16Required = countByConditions(data, [['STATUS', 'COM'], ['AS16', '!=', 'Y']]);
    const as17Required = countByConditions(data, [['STATUS', 'COM'], ['AS17', '!=', 'Y']]);

    const noGoalInJobPlan = countByConditions(data, [['STATUS', 'COM'], ['JOB_PLAN_GOAL', '']]);// Assuming empty or no value

    return [
      { label: 'Current Active Caseload', count: totalCaseload },
      { label: 'Commenced', count: commenced },
      { label: 'Pending', count: pending },
      { label: 'Suspended', count: suspended },
      { label: 'Total', count: totalCaseload },

      { label: 'Job Seeker Servicing Type', count: null, className: 'job-seeker-servicing-type' },

      { label: 'Work for the Dole', count: null, className: 'work-for-the-dole' },
      { label: 'Commenced (COM WFD Coded)', count: comWfdCoded, className: 'commenced-wfd-coded' },
      { label: 'Pending (PND WFD Coded)', count: pndWfdCoded, className: 'pnd-wfd-coded' },
      { label: 'Suspended (SUS WFD Coded)', count: susWfdCoded, className: 'sus-wfd-coded' },
      { label: 'WFD Expired last 3 months', count: wfdExpired, className: 'wfd-expired' },
      { label: 'Commenced WFD not Coded', count: comWfdNotCoded, className: 'commenced-wfd-not-coded' },
      { label: 'Suspended WFD not Coded', count: susWfdNotCoded, className: 'suspended-wfd-not-coded' },
      { label: 'Commenced JSCI not updated in last 3 months', count: 0, className: 'commenced-jsci-not-updated' }, // Placeholder, implement logic if needed
      { label: 'Commenced Resume not updated in last 3 months', count: 0, className: 'commenced-resume-not-updated' }, // Placeholder, implement logic if needed

      { label: 'Job Plans', count: null, className: 'job-plans' },
      { label: 'COMMENCED JP NOT APPROVED', count: jpNotApproved, className: 'job-plans-item' },
      { label: 'COMMENCED AI12 CODE REQUIRED', count: ai12Required, className: 'job-plans-item' },
      { label: 'COMMENCED JS09 CODE REQUIRED', count: js09Required, className: 'job-plans-item' },
      { label: 'COMMENCED JS10 CODE REQUIRED', count: js10Required, className: 'job-plans-item' },
      { label: 'COMMENCED AS05 CODE REQUIRED', count: as05Required, className: 'job-plans-item' },
      { label: 'COMMENCED AS11 CODE REQUIRED', count: as11Required, className: 'job-plans-item' },
      { label: 'COMMENCED AS15 CODE REQUIRED', count: as15Required, className: 'job-plans-item' },
      { label: 'COMMENCED AS16 CODE REQUIRED', count: as16Required, className: 'job-plans-item' },
      { label: 'COMMENCED AS17 CODE REQUIRED', count: as17Required, className: 'job-plans-item' },
      { label: 'Commenced NO GOAL IN JOB PLAN', count: noGoalInJobPlan, className: 'job-plans-item' },

      { label: 'EMPLOYMENT', count: null, className: 'employment' },
      { label: 'Num of clients employed and tracked', count: 0, className: 'employment-item' }, // Placeholder, implement logic if needed
      { label: 'Num of clients employed not tracked', count: 0, className: 'employment-item' }, // Placeholder, implement logic if needed
    ];
  };

  // Calculate stats for Kliea and Sylvanas
  const klieaStats = calculateStats(klieaData);
  const sylvanasStats = calculateStats(sylvanasData);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Job Seekers Statistics</h1>
      <div className={styles.tablesWrapper}>
        <div className={styles.tableContainer}>
          <h2>Site</h2>
          <DataTable stats={calculateStats(data)} data={data} />
        </div>
        <div className={styles.tableContainer}>
          <h2>Kliea</h2>
          <DataTable stats={klieaStats} data={klieaData} />
        </div>
        <div className={styles.tableContainer}>
          <h2>Sylvanas</h2>
          <DataTable stats={sylvanasStats} data={sylvanasData} />
        </div>
      </div>
    </div>
  );
};

// Fetch data from JSON file
export const getServerSideProps: GetServerSideProps = async () => {
  const filePath = path.join(process.cwd(), 'public', 'SUB216.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const data: JobSeeker[] = JSON.parse(jsonData).in;

  return {
    props: {
      data,
    },
  };
};

export default DataSetPage;























// import { GetServerSideProps } from 'next';
// import fs from 'fs';
// import path from 'path';
// import styles from '../styles/Dataset.module.scss';
// import { JobSeeker } from '../types';
// import { countByColumn, countByConditions } from '../utils';
// import DataTable from '../components/DataTable';
// import React, { useState } from 'react';

// interface Props {
//   data: JobSeeker[];
// }

// const DataSetPage = ({ data }: Props) => {
//   const now = new Date();

//   // Helper function to calculate expired WE12_END_DATE (older than 3 months)
//   const calculateWFDExpired = (item: JobSeeker) => {
//     const we12EndDate = new Date(item.WE12_END_DATE);
//     const diffInMonths = (now.getFullYear() - we12EndDate.getFullYear()) * 12 + (now.getMonth() - we12EndDate.getMonth());
//     return diffInMonths > 3;
//   };

//   // Filter data for Kliea and Sylvanas
//   const klieaData = data.filter(item => item.MANAGED_BY === 'FHTGKL52');
//   const sylvanasData = data.filter(item => item.MANAGED_BY === 'VXJFZS75');

//   // Function to calculate stats for given data
//   const calculateStats = (data: JobSeeker[]) => {
//     const commenced = countByColumn(data, 'STATUS', 'COM');
//     const pending = countByColumn(data, 'STATUS', 'PND');
//     const suspended = countByColumn(data, 'STATUS', 'SUS');
//     const totalCaseload = commenced + pending + suspended;

//     const comWfdCoded = countByConditions(data, [['STATUS', 'COM'], ['IN_WFD_ACTIVITY_FLAG', 'Y']]);
//     const pndWfdCoded = countByConditions(data, [['STATUS', 'PND'], ['IN_WFD_ACTIVITY_FLAG', 'Y']]);
//     const susWfdCoded = countByConditions(data, [['STATUS', 'SUS'], ['IN_WFD_ACTIVITY_FLAG', 'Y']]);
//     const wfdExpired = data.filter(item => calculateWFDExpired(item) && item.STATUS === 'COM').length;
//     const comWfdNotCoded = countByConditions(data, [['STATUS', 'COM'], ['IN_WFD_ACTIVITY_FLAG', 'N']]);
//     const susWfdNotCoded = countByConditions(data, [['STATUS', 'SUS'], ['IN_WFD_ACTIVITY_FLAG', 'N']]);

//     const jpNotApproved = countByConditions(data, [['STATUS', 'COM'], ['JOB_PLAN_STATUS', '!=', 'A']]);
//     const ai12Required = countByConditions(data, [['STATUS', 'COM'], ['AI12', '!=', 'C']]);
//     const js09Required = countByConditions(data, [['STATUS', 'COM'], ['JS09_TYPE', '!=', ['C', 'V']]]);
//     const js10Required = countByConditions(data, [['STATUS', 'COM'], ['JS10', '!=', 'C']]);
//     const as05Required = countByConditions(data, [['STATUS', 'COM'], ['AS05', '!=', 'Y']]);
//     const as11Required = countByConditions(data, [['STATUS', 'COM'], ['AS11', '!=', 'Y']]);
//     const as15Required = countByConditions(data, [['STATUS', 'COM'], ['AS15', '!=', 'Y']]);
//     const as16Required = countByConditions(data, [['STATUS', 'COM'], ['AS16', '!=', 'Y']]);
//     const as17Required = countByConditions(data, [['STATUS', 'COM'], ['AS17', '!=', 'Y']]);

//     const noGoalInJobPlan = countByConditions(data, [['STATUS', 'COM'], ['JOB_PLAN_GOAL', '']]);// Assuming empty or no value

//     return [
//       { label: 'Current Active Caseload', count: totalCaseload },
//       { label: 'Commenced', count: commenced },
//       { label: 'Pending', count: pending },
//       { label: 'Suspended', count: suspended },
//       { label: 'Total', count: totalCaseload },

//       { label: 'Job Seeker Servicing Type', count: null },

//       { label: 'Work for the Dole', count: null },
//       { label: 'Commenced (COM WFD Coded)', count: comWfdCoded },
//       { label: 'Pending (PND WFD Coded)', count: pndWfdCoded },
//       { label: 'Suspended (SUS WFD Coded)', count: susWfdCoded },
//       { label: 'WFD Expired last 3 months', count: wfdExpired },
//       { label: 'Commenced WFD not Coded', count: comWfdNotCoded },
//       { label: 'Suspended WFD not Coded', count: susWfdNotCoded },
//       { label: 'Commenced JSCI not updated in last 3 months', count: 0 }, // Placeholder, implement logic if needed
//       { label: 'Commenced Resume not updated in last 3 months', count: 0 }, // Placeholder, implement logic if needed

//       { label: 'Job Plans', count: null },
//       { label: 'COMMENCED JP NOT APPROVED', count: jpNotApproved },
//       { label: 'COMMENCED AI12 CODE REQUIRED', count: ai12Required },
//       { label: 'COMMENCED JS09 CODE REQUIRED', count: js09Required },
//       { label: 'COMMENCED JS10 CODE REQUIRED', count: js10Required },
//       { label: 'COMMENCED AS05 CODE REQUIRED', count: as05Required },
//       { label: 'COMMENCED AS11 CODE REQUIRED', count: as11Required },
//       { label: 'COMMENCED AS15 CODE REQUIRED', count: as15Required },
//       { label: 'COMMENCED AS16 CODE REQUIRED', count: as16Required },
//       { label: 'COMMENCED AS17 CODE REQUIRED', count: as17Required },
//       { label: 'Commenced NO GOAL IN JOB PLAN', count: noGoalInJobPlan },

//       { label: 'EMPLOYMENT', count: null },
//       { label: 'Num of clients employed and tracked', count: 0 }, // Placeholder, implement logic if needed
//       { label: 'Num of clients employed not tracked', count: 0 }, // Placeholder, implement logic if needed
//     ];
//   };

//   // Calculate stats for Kliea and Sylvanas
//   const klieaStats = calculateStats(klieaData);
//   const sylvanasStats = calculateStats(sylvanasData);

//   // Dropdown selection for filtering data
//   const [selectedFilterSite, setSelectedFilterSite] = useState<string>('all');
//   const [selectedFilterKliea, setSelectedFilterKliea] = useState<string>('all');
//   const [selectedFilterSylvanas, setSelectedFilterSylvanas] = useState<string>('all');

//   // Filtered data based on dropdown selection
//   const filteredSiteData = selectedFilterSite === 'all' ? data : data.filter(item => item.STATUS === selectedFilterSite);
//   const filteredKlieaData = selectedFilterKliea === 'all' ? klieaData : klieaData.filter(item => item.STATUS === selectedFilterKliea);
//   const filteredSylvanasData = selectedFilterSylvanas === 'all' ? sylvanasData : sylvanasData.filter(item => item.STATUS === selectedFilterSylvanas);

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.header}>Job Seekers Statistics</h1>
      
//       <div className={styles.dropdownContainer}>
//         <div>
//           <label htmlFor="filter-site" className={styles.dropdownLabel}>Site Data Filter:</label>
//           <select id="filter-site" className={styles.dropdown} onChange={(e) => setSelectedFilterSite(e.target.value)} value={selectedFilterSite}>
//             <option value="all">All</option>
//             <option value="COM">Commenced</option>
//             <option value="PND">Pending</option>
//             <option value="SUS">Suspended</option>
//           </select>
//         </div>
//         <div>
//           <label htmlFor="filter-kliea" className={styles.dropdownLabel}>Kliea Data Filter:</label>
//           <select id="filter-kliea" className={styles.dropdown} onChange={(e) => setSelectedFilterKliea(e.target.value)} value={selectedFilterKliea}>
//             <option value="all">All</option>
//             <option value="COM">Commenced</option>
//             <option value="PND">Pending</option>
//             <option value="SUS">Suspended</option>
//           </select>
//         </div>
//         <div>
//           <label htmlFor="filter-sylvanas" className={styles.dropdownLabel}>Sylvanas Data Filter:</label>
//           <select id="filter-sylvanas" className={styles.dropdown} onChange={(e) => setSelectedFilterSylvanas(e.target.value)} value={selectedFilterSylvanas}>
//             <option value="all">All</option>
//             <option value="COM">Commenced</option>
//             <option value="PND">Pending</option>
//             <option value="SUS">Suspended</option>
//           </select>
//         </div>
//       </div>

//       <div className={styles.tablesWrapper}>
//         <div className={styles.tableContainer}>
//           <h2>Site</h2>
//           <DataTable stats={calculateStats(filteredSiteData)} />
//         </div>
//         <div className={styles.tableContainer}>
//           <h2>Kliea</h2>
//           <DataTable stats={calculateStats(filteredKlieaData)} />
//         </div>
//         <div className={styles.tableContainer}>
//           <h2>Sylvanas</h2>
//           <DataTable stats={calculateStats(filteredSylvanasData)} />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Fetch data from JSON file
// export const getServerSideProps: GetServerSideProps = async () => {
//   const filePath = path.join(process.cwd(), 'public', 'SUB216.json');
//   const jsonData = fs.readFileSync(filePath, 'utf8');
//   const data: JobSeeker[] = JSON.parse(jsonData).in;

//   return {
//     props: {
//       data,
//     },
//   };
// };

// export default DataSetPage;























































































































// import { GetServerSideProps } from 'next';
// import fs from 'fs';
// import path from 'path';
// import styles from '../styles/Dataset.module.scss';
// import { JobSeeker } from '../types';
// import { countByColumn, countByConditions } from '../utils';
// import DataTable from '../components/DataTable';

// interface Props {
//   data: JobSeeker[];
// }

// const DataSetPage = ({ data }: Props) => {
//   const now = new Date();

//   // Helper function to calculate expired WE12_END_DATE (older than 3 months)
//   const calculateWFDExpired = (item: JobSeeker) => {
//     const we12EndDate = new Date(item.WE12_END_DATE);
//     const diffInMonths = (now.getFullYear() - we12EndDate.getFullYear()) * 12 + (now.getMonth() - we12EndDate.getMonth());
//     return diffInMonths > 3;
//   };

//   // Calculate individual counts for caseload
//   const calculateCounts = (data: JobSeeker[]) => {
//     const commenced = countByColumn(data, 'STATUS', 'COM');
//     const pending = countByColumn(data, 'STATUS', 'PND');
//     const suspended = countByColumn(data, 'STATUS', 'SUS');
//     const totalCaseload = commenced + pending + suspended;

//     const comWfdCoded = countByConditions(data, [['STATUS', 'COM'], ['IN_WFD_ACTIVITY_FLAG', 'Y']]);
//     const pndWfdCoded = countByConditions(data, [['STATUS', 'PND'], ['IN_WFD_ACTIVITY_FLAG', 'Y']]);
//     const susWfdCoded = countByConditions(data, [['STATUS', 'SUS'], ['IN_WFD_ACTIVITY_FLAG', 'Y']]);
//     const wfdExpired = data.filter(item => calculateWFDExpired(item) && item.STATUS === 'COM').length;
//     const comWfdNotCoded = countByConditions(data, [['STATUS', 'COM'], ['IN_WFD_ACTIVITY_FLAG', 'N']]);
//     const susWfdNotCoded = countByConditions(data, [['STATUS', 'SUS'], ['IN_WFD_ACTIVITY_FLAG', 'N']]);

//     const jpNotApproved = countByConditions(data, [['STATUS', 'COM'], ['JOB_PLAN_STATUS', '!=', 'A']]);
//     const ai12Required = countByConditions(data, [['STATUS', 'COM'], ['AI12', '!=', 'C']]);
//     const js09Required = countByConditions(data, [['STATUS', 'COM'], ['JS09_TYPE', '!=', ['C', 'V']]]);
//     const js10Required = countByConditions(data, [['STATUS', 'COM'], ['JS10', '!=', 'C']]);
//     const as05Required = countByConditions(data, [['STATUS', 'COM'], ['AS05', '!=', 'Y']]);
//     const as11Required = countByConditions(data, [['STATUS', 'COM'], ['AS11', '!=', 'Y']]);
//     const as15Required = countByConditions(data, [['STATUS', 'COM'], ['AS15', '!=', 'Y']]);
//     const as16Required = countByConditions(data, [['STATUS', 'COM'], ['AS16', '!=', 'Y']]);
//     const as17Required = countByConditions(data, [['STATUS', 'COM'], ['AS17', '!=', 'Y']]);

//     const jpNoGoal = countByConditions(data, [['STATUS', 'COM'], ['JOB_PLAN_GOAL', '']]);

//     const stats = [
//       { label: 'Current Active Caseload', count: totalCaseload },
//       { label: 'Commenced', count: commenced },
//       { label: 'Pending', count: pending },
//       { label: 'Suspended', count: suspended },
//       { label: 'Total', count: totalCaseload },

//       { label: 'Job Seeker Servicing Type', count: null },

//       { label: 'Work for the Dole', count: null },
//       { label: 'Commenced (COM WFD Coded)', count: comWfdCoded },
//       { label: 'Pending (PND WFD Coded)', count: pndWfdCoded },
//       { label: 'Suspended (SUS WFD Coded)', count: susWfdCoded },
//       { label: 'WFD Expired last 3 months', count: wfdExpired },
//       { label: 'Commenced WFD not Coded', count: comWfdNotCoded },
//       { label: 'Suspended WFD not Coded', count: susWfdNotCoded },
//       { label: 'Commenced JSCI not updated in last 3 months', count: 0 },
//       { label: 'Commenced Resume not updated in last 3 months', count: 0 },

//       { label: 'Job Plans', count: null },
//       { label: 'COMMENCED JP NOT APPROVED', count: jpNotApproved },
//       { label: 'COMMENCED AI12 CODE REQUIRED', count: ai12Required },
//       { label: 'COMMENCED JS09 CODE REQUIRED', count: js09Required },
//       { label: 'COMMENCED JS10 CODE REQUIRED', count: js10Required },
//       { label: 'COMMENCED AS05 CODE REQUIRED', count: as05Required },
//       { label: 'COMMENCED AS11 CODE REQUIRED', count: as11Required },
//       { label: 'COMMENCED AS15 CODE REQUIRED', count: as15Required },
//       { label: 'COMMENCED AS16 CODE REQUIRED', count: as16Required },
//       { label: 'COMMENCED AS17 CODE REQUIRED', count: as17Required },
//       { label: 'Commenced NO GOAL IN JOB PLAN', count: jpNoGoal },

//       { label: 'EMPLOYMENT', count: null },
//       { label: 'Num of clients employed and tracked', count: 0 },
//       { label: 'Num of clients employed not tracked', count: 0 }
//     ];

//     return stats;
//   };

//   // Create separate data sets for Kliea and Sylvanas
//   const klieaData = data.filter(item => item.MANAGED_BY === 'FHTGKL52');
//   const sylvanasData = data.filter(item => item.MANAGED_BY === 'VXJFZS75');

//   const siteStats = calculateCounts(data);
//   const klieaStats = calculateCounts(klieaData);
//   const sylvanasStats = calculateCounts(sylvanasData);

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.header}>Job Seekers Statistics</h1>
//       <div className={styles.tableWrapper}>
//         <div className={styles.tableContainer}>
//           <h2>Site</h2>
//           <DataTable stats={siteStats} />
//         </div>
//         <div className={styles.tableContainer}>
//           <h2>Kliea</h2>
//           <DataTable stats={klieaStats} />
//         </div>
//         <div className={styles.tableContainer}>
//           <h2>Sylvanas</h2>
//           <DataTable stats={sylvanasStats} />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Fetch data from JSON file
// export const getServerSideProps: GetServerSideProps = async () => {
//   const filePath = path.join(process.cwd(), 'public', 'SUB216.json');
//   const jsonData = fs.readFileSync(filePath, 'utf8');
//   const data: JobSeeker[] = JSON.parse(jsonData).in;

//   return {
//     props: {
//       data,
//     },
//   };
// };

// export default DataSetPage;

