import React, { useState } from 'react';
import { JobSeeker } from '../types';
import styles from '../styles/DataTable.module.scss';

interface DataTableProps {
  stats: any[];
  data: JobSeeker[];
}

const DataTable = ({ stats, data }: DataTableProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Function to handle dropdown toggle
  const handleToggleDropdown = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  // Function to get clients based on the stat label
  const getClientsList = (label: string) => {
    switch (label) {
      case 'Commenced WFD not Coded':
        return data.filter(item => item.STATUS === 'COM' && item.IN_WFD_ACTIVITY_FLAG === 'N');
      case 'Pending (PND WFD Coded)':
        return data.filter(item => item.STATUS === 'PND' && item.IN_WFD_ACTIVITY_FLAG === 'Y');
      case 'Suspended (SUS WFD Coded)':
        return data.filter(item => item.STATUS === 'SUS' && item.IN_WFD_ACTIVITY_FLAG === 'Y');
      case 'WFD Expired last 3 months':
        return data.filter(item => calculateWFDExpired(item) && item.STATUS === 'COM');
      // Add more cases as needed
      default:
        return [];
    }
  };

  // Helper function to calculate expired WE12_END_DATE (older than 3 months)
  const calculateWFDExpired = (item: JobSeeker) => {
    const now = new Date();
    const we12EndDate = new Date(item.WE12_END_DATE);
    const diffInMonths = (now.getFullYear() - we12EndDate.getFullYear()) * 12 + (now.getMonth() - we12EndDate.getMonth());
    return diffInMonths > 3;
  };

  return (
    <div className={styles.dataTable}>
      <table>
        <thead>
          <tr>
            <th>Statistic</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <React.Fragment key={stat.label}>
              <tr className={stat.className} onClick={() => handleToggleDropdown(stat.label)}>
                <td>{stat.label}</td>
                <td>{stat.count}</td>
              </tr>
              {expandedItem === stat.label && (
                <tr>
                  <td colSpan={2}>
                    <div className={styles.dropdown}>
                      <table>
                        <thead>
                          <tr>
                            <th>JOB_SEEKER_ID</th>
                            <th>FIRST_GIVEN_NAME</th>
                            <th>FAMILY_NAME</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getClientsList(stat.label).map(client => (
                            <tr key={client.JOB_SEEKER_ID}>
                              <td>{client.JOB_SEEKER_ID}</td>
                              <td>{client.FIRST_GIVEN_NAME}</td>
                              <td>{client.FAMILY_NAME}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;










// import React from 'react';
// import styles from '../styles/Dataset.module.scss';

// interface DataTableProps {
//   stats: {
//     label: string;
//     count: number | null;
//   }[];
// }

// const DataTable: React.FC<DataTableProps> = ({ stats }) => {
//   return (
//     <table className={styles.table}>
//       <thead>
//         <tr>
//           <th>Label</th>
//           <th>Count</th>
//         </tr>
//       </thead>
//       <tbody>
//         {stats.map((item, index) => (
//           <tr key={index}>
//             <td>{item.label}</td>
//             <td>{item.count !== null ? item.count : '-'}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default DataTable;
































































// import React, { useState } from 'react';
// import styles from '../styles/DataTable.module.scss';

// interface DataTableProps {
//   stats: { label: string; count: number | null }[];
// }

// const DataTable = ({ stats }: DataTableProps) => {
//   const [expandedRow, setExpandedRow] = useState<string | null>(null);

//   const handleRowClick = (label: string) => {
//     setExpandedRow(expandedRow === label ? null : label);
//   };

//   return (
//     <table className={styles.table}>
//       <tbody>
//         {stats.map((item, index) => (
//           <React.Fragment key={index}>
//             <tr>
//               <td className={styles.label} onClick={() => handleRowClick(item.label)}>
//                 {item.label}
//               </td>
//               <td className={styles.count}>
//                 {item.count !== null ? item.count : ''}
//               </td>
//             </tr>
//             {expandedRow === item.label && item.label.includes('WFD not Coded') && (
//               <tr>
//                 <td colSpan={2}>
//                   <table className={styles.nestedTable}>
//                     <thead>
//                       <tr>
//                         <th>JOB_SEEKER_ID</th>
//                         <th>FIRST_GIVEN_NAME</th>
//                         <th>FAMILY_NAME</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {/* Map over the data to populate this table */}
//                       {/* For example: */}
//                       {/* {wfdNotCodedData.map((client) => ( */}
//                       {/*   <tr key={client.JOB_SEEKER_ID}> */}
//                       {/*     <td>{client.JOB_SEEKER_ID}</td> */}
//                       {/*     <td>{client.FIRST_GIVEN_NAME}</td> */}
//                       {/*     <td>{client.FAMILY_NAME}</td> */}
//                       {/*   </tr> */}
//                       {/* ))} */}
//                     </tbody>
//                   </table>
//                 </td>
//               </tr>
//             )}
//           </React.Fragment>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default DataTable;

