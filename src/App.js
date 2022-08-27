import React, { useState } from 'react'
import { Button, Form, Input, Select, Table } from 'antd'
import { format } from 'date-fns'
import { useDebounce } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'
import qs from 'qs'

const columns = [
	{
		title: 'Username',
		dataIndex: ['login', 'username'],
    sorter: true,
	},
	{
		title: 'Name',
		dataIndex: 'name',
		sorter: true,
		render: name => `${name.first} ${name.last}`,
	},
	{
		title: 'Email',
		dataIndex: 'email',
		sorter: true,
	},
	{
		title: 'Gender',
		dataIndex: 'gender',
		sorter: true,
	},
	{
		title: 'Registered Date',
		dataIndex: ['registered', 'date'],
		sorter: true,
		render: date => format(Date.parse(date), 'dd-MM-yyyy HH:mm'),
	},
]

const getRandomuserParams = ({ pagination, sorters, filters }) => ({
	results: pagination?.pageSize,
	page: pagination?.current,
	...sorters,
	...filters,
})

const fetchUsers = async ({ queryKey: [_key, params] }) => {
	const response = await fetch(
		`https://randomuser.me/api?${qs.stringify(getRandomuserParams(params), {
			filter: (_, value) => value || undefined,
		})}`
	)
	if (!response.ok) {
		throw new Error('Oh no')
	}
	return response.json()
}

const Header = ({ onChange, initialValues = { keyword: '', gender: '' } }) => {
	const [form] = Form.useForm()

  // workaround
  // `onChange` is not called when `form.resetFields()` or `<Button htmlType="reset"/>` clicked
  // https://ant.design/components/form/#setFieldsValue-do-not-trigger-onFieldsChange-or-onValuesChange
	const handleReset = () => {
		form.resetFields()
		onChange(initialValues, initialValues)
	}

	return (
		<Form
			form={form}
			name="table-filter"
			layout="inline"
			initialValues={initialValues}
			onValuesChange={onChange}
		>
			<Form.Item name="keyword">
				<Input.Search placeholder="Search..." enterButton />
			</Form.Item>
			<Form.Item name="gender">
				<Select style={{ width: 200 }}>
					<Select.Option value="">All</Select.Option>
					<Select.Option value="male">Male</Select.Option>
					<Select.Option value="female">Female</Select.Option>
				</Select>
			</Form.Item>
			<Button type="primary" onClick={handleReset}>
				Reset Filter
			</Button>
		</Form>
	)
}

const App = () => {
	const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
	const [sorters, setSorters] = useState({})
	const [filters, setFilters] = useState({})

	const [fetchUsersParams] = useDebounce({ pagination, sorters, filters }, 500)
	const { data, loading } = useQuery(['users', fetchUsersParams], fetchUsers)

	const handleTableChange = (newPagination, _filters, sorters) => {
		setPagination(prevPagination => ({
			...prevPagination,
			current: newPagination.current,
			pageSize: newPagination.pageSize,
		}))
		setSorters({
			sortBy: sorters.field,
			sortOrder: sorters.order,
		})
	}

	const handleFiltersChange = (_changedValues, currentValues) => {
		setFilters(currentValues)
	}

	return (
		<Table
			columns={columns}
			rowKey={record => record.login.uuid}
			dataSource={data?.results || []}
			pagination={{ ...pagination, total: 10 * 10000, showSizeChanger: false }}
			loading={loading}
			filtered={Object.keys(filters).length > 0}
			filteredValue={Object.keys(filters)}
			onChange={handleTableChange}
			title={() => <Header onChange={handleFiltersChange} />}
		/>
	)
}

export default App
