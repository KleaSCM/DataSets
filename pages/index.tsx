// pages/index.tsx

import { GetServerSideProps } from 'next';
import fs from 'fs';
import path from 'path';
import styles from '../styles/styles.module.scss'; // Import styles

interface JobSeeker {
  // Define the job seeker properties
  EXTRACT_DATE: string;
  ORG_NAME: string;
  ORG_CODE: string;
  REGION_NAME: string;
  REGION_CODE: string;
  SITE_NAME: string;
  SITE_CODE: string;
  COMMUNITY_NAME: string;
  COMMUNITY_CODE: string;
  JOB_SEEKER_ID: number;
  FIRST_GIVEN_NAME: string;
  FAMILY_NAME: string;
  CDP_ELIGIBILITY: string;
  STATUS: string;
  WFD_ELIGIBILITY_FLAG: string;
  MUTUAL_OBLIGATION_REQUIREMENT: string;
  ALLOWANCE_RATE_TYPE: string;
  EXPECTED_HOURS: number;
  TOTAL_HOURS_COMPULSORY: number;
  TOTAL_HOURS_VOLUNTARY: number;
  WE12: string;
  IN_WFD_ACTIVITY_FLAG: string;
  PCP: string;
  PWC: string;
  ESL: string;
  MA: string;
  DATE_OF_BIRTH: string;
  AGE: number;
  MANAGED_BY: string;
  SUSP_REASON_CODE: string;
  SUSP_REASON_DESC: string;
  JOB_PLAN_STATUS: string;
  JOB_PLAN_STATUS_DATE: string;
  LAST_ACTIVITY_PERIOD_RESULT: string;
  LAST_ACTIVITY_PERIOD_HOURS: string;
  AI01: string;
  AI12: string;
  JS02: string;
  JS05: string;
  JS06: string;
  JS07: string;
  JS08: string;
  JS09CONTACTS: string;
  JS09_TYPE: string;
  JS09_REASON: string;
  JS09_DOMT: string;
  JS10: string;
  EM52: string;
  EM54: string;
  EM56: string;
  WE08: string;
  WE09: string;
  WE11: string;
  WE15: string;
  WE17: string;
  WE18: string;
  ET52: string;
  ET53: string;
  ET56: string;
  ET57: string;
  ET59: string;
  ET60: string;
  ET64: string;
  RE03: string;
  RE04: string;
  NV02: string;
  NV04: string;
  NV05: string;
  NV07: string;
  NV09: string;
  NV10: string;
  NV12: string;
  NV13: string;
  NV14: string;
  DHS_ACTIVITIES_AI02: string;
  DHS_ACTIVITIES_AI08: string;
  DHS_ACTIVITIES_EM51: string;
  DHS_ACTIVITIES_WE16: string;
  DHS_ACTIVITIES_ET63: string;
  FTXT: string;
  USER_TYPE: string;
  WE12_END_DATE: string;
  LLN_REQUIRED: string;
  AS02: string;
  AS03: string;
  AS04: string;
  AS05: string;
  AS06: string;
  AS07: string;
  AS08: string;
  AS09: string;
  AS10: string;
  AS11: string;
  AS12: string;
  AS13: string;
  AS14: string;
  AS15: string;
  AS16: string;
  AS17: string;
  AS18: string;
  AS19: string;
  AS20: string;
  ESAt_JCA_STATUS: string;
  HOURS_SCHEDULED_IN_NEXT_FORTNIGHT: string;
  ALL_FUTURE_HOURS: string;
  CCA_IN_PROGRESS: string;
  CCA_START_DATE: string;
  TOWD: string;
  TOWD_START_DATE: string;
  TOWD_END_DATE: string;
  Job_Plan_Compliant: string;
  Job_Plan_Not_Compliant_Reason: string;
  Job_Plan_Goal: string;
}

interface Props {
  data: JobSeeker[];
}

const HomePage = ({ data }: Props) => {
  const headings = Object.keys(data[0]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Job Seekers Data</h1>
      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                {headings.map((heading) => (
                  <th key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {data.map((item, index) => (
                <tr key={index}>
                  {headings.map((heading) => (
                    <td key={heading}>{(item as any)[heading]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const filePath = path.join(process.cwd(), 'public', 'SUB216.json');
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const data: JobSeeker[] = jsonData.in;

  return {
    props: {
      data,
    },
  };
};

export default HomePage;
