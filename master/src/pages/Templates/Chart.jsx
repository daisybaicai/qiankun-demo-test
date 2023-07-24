import React from 'react';
import { Card } from 'antd';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import TreeGraph from '@/components/TreeGraph';
import TreeMap from '@/components/TreeMap';

export default function Chart() {
  const data = [
    {
      id: 1,
      name: '河南投资集团有限公司',
      age: 60,
      address: 'New York No. 1 Lake Park',
      children: [
        {
          id: 11,
          name: '河南省天然气管网有限公司河南省天然气管网有限公司河南省天然气管网有限公司河南省天然气管网有限公司',
          // name: '河南省天然气管网有限公司',
          age: 42,
          address: 'New York No. 2 Lake Park',
        },
        {
          id: 12,
          name: '郑州豫能热电有限公司',
          age: 42,
          address: 'New York No. 2 Lake Park',
        },
        {
          id: 13,
          name: '河南豫能控股股份有限公司',
          age: 30,
          address: 'New York No. 3 Lake Park',
          children: [
            {
              id: 131,
              name: '濮阳豫能发电有限责任公司',
              age: 16,
              address: 'New York No. 3 Lake Park',
            },
            {
              id: 132,
              name: '鹤壁鹤淇发电有限责任公司',
              age: 16,
              address: 'New York No. 3 Lake Park',
            },
          ],
        },
        {
          id: 14,
          name: '焦作天力电力投资有限公司',
          age: 42,
          address: 'New York No. 2 Lake Park',
        },
        {
          id: 15,
          name: '河南省电力集团有限公司',
          age: 30,
          address: 'New York No. 3 Lake Park',
          children: [
            {
              id: 151,
              name: '222',
              age: 16,
              address: 'New York No. 3 Lake Park',
            },
            {
              id: 152,
              name: '333',
              age: 16,
              address: 'New York No. 3 Lake Park',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: '国网河南省电力公司',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
  ];

  const data1 = [
    {
      id: 1,
      name: '托管总数额',
      value: '907,100.23',
      children: [
        {
          id: 11,
          name: '固定收益托管',
          value: '7,100.23',
          iconStyle: {
            background: '#2278FA',
          },
        },
        {
          id: 12,
          name: '置换',
          value: '2,100.55',
          iconStyle: {
            background: '#68C57C',
          },
        },
        {
          id: 13,
          name: '远期回购',
          value: '3,100.20',
          iconStyle: {
            background: '#FFC100',
          },
        },
        {
          id: 14,
          name: '代为履约',
          value: '1,123.78',
          iconStyle: {
            background: '#7262FD',
          },
        },
      ],
    },
  ];

  const graphData = {
    id: 'g1',
    name: '河南投资集团有限公司',
    value: '100.23',
    children: [
      {
        id: 'g12',
        name: '豫能控股集团有限公司',
        value: '338.00',
        children: [
          {
            id: 'g121',
            name: 'Name3',
            value: '138.00',
            collapsed: true,
            children: [
              {
                id: 'g1211',
                name: 'Name4',
                value: '138.00',
              },
            ],
          },
          {
            id: 'g122',
            name: 'Name5',
            value: '100.00',
            collapsed: true,
            children: [
              {
                id: 'g1221',
                name: 'Name6',
                value: '40.00',
                collapsed: true,
                children: [
                  {
                    id: 'g12211',
                    name: 'Name6-1',
                    value: '40.00',
                    unit: 'tCO2/万元',
                  },
                ],
              },
              {
                id: 'g1222',
                name: 'Name7',
                value: '60.00',
                unit: 'tCO2/万元',
              },
            ],
          },
          {
            id: 'g123',
            name: 'Name8',
            value: '100.00',
            collapsed: true,
            children: [
              {
                id: 'g1231',
                name: 'Name8-1',
                value: '100.00',
              },
            ],
          },
        ],
      },
      {
        id: 'g13',
        name: 'Name9',
        value: '100.90',
        children: [
          {
            id: 'g131',
            name: 'Name10',
            value: '33.90',
          },
          {
            id: 'g132',
            name: 'Name11',
            value: '67.00',
          },
        ],
      },
      {
        id: 'g14',
        name: 'Name12',
        value: '100.00',
      },
    ],
  };
  return (
    <PageContainer breadcrumb={null}>
      <Card bordered={false}>
        <ProCard title="组织架构图" bordered>
          <TreeGraph data={graphData} />
        </ProCard>

        <ProCard title="线级关系" ghost gutter={[30, 8]}>
          <ProCard title="线级关系1" colSpan={12} bordered>
            <TreeMap data={data} />
          </ProCard>
          <ProCard title="线级关系2" colSpan={12} bordered>
            <TreeMap data={data1} />
          </ProCard>
        </ProCard>
      </Card>
    </PageContainer>
  );
}
