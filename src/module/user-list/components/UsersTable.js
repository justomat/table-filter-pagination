import React, { useCallback } from 'react'
import { Table } from 'antd'
import { format } from 'date-fns'

const columns = [
	{
		title: 'Username',
		dataIndex: ['login', 'username'],
	},
	{
		title: 'Name',
		dataIndex: 'name',
		render: name => `${name.first} ${name.last}`,
	},
	{
		title: 'Email',
		dataIndex: 'email',
	},
	{
		title: 'Gender',
		dataIndex: 'gender',
	},
	{
		title: 'Registered Date',
		dataIndex: ['registered', 'date'],
		render: date => format(Date.parse(date), 'dd-MM-yyyy HH:mm'),
	},
].map((column, _index, columns) => ({
	...column,
	sorter: true,
	width: `${Math.floor(100 / columns.length)}%`,
}))

const UsersTable = ({
	data,
	loading,
	pagination,
	setPagination,
	setSorters,
	filters,
}) => {
	const handleTableChange = useCallback(
		(_pagination, _filters, _sorters) => {
			setPagination(prev => ({
				...prev,
				current: _pagination.current,
				pageSize: _pagination.pageSize,
			}))
			setSorters({
				sortBy: _sorters.field,
				sortOrder: _sorters.order,
			})
		},
		[setPagination, setSorters]
	)

	console.log(filters)

	// prettier-ignore
	return (
		<Table
			columns={columns}
			rowKey={record => record.login.uuid}
			
			dataSource={data || []}
			loading={loading}
			
			// relay pagination & sorting changes to prop source
			onChange={handleTableChange}
			
			filtered={Object.keys(filters).length > 0}
			filteredValue={Object.keys(filters)}
			
			// title={header}
			pagination={{
				current: pagination.current,
				pageSize: pagination.pageSize,
				total: pagination.pageSize * 10000, // API's max page
				showSizeChanger: false,
			}}
		/>
	)
}

export default UsersTable
