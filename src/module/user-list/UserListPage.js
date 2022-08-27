import { Breadcrumb, Typography } from 'antd'
import { useState } from 'react'

import UsersTable from './components/UsersTable'
import UsersTableHeader from './components/UsersTableHeader'
import useUserList from './useUserList'

export default function UserListPage() {
	const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
	const [sorters, setSorters] = useState({})
	const [filters, setFilters] = useState({})

	const { data, loading } = useUserList({ pagination, sorters, filters })

	return (
		<section style={{ padding: 16 }}>
			<nav>
				<Breadcrumb>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item>Example Page</Breadcrumb.Item>
				</Breadcrumb>
			</nav>

			<header>
				<Typography.Title level={2}>
					Example With Search and Filter
				</Typography.Title>
			</header>

			<main>
				<UsersTableHeader onChange={(_, values) => setFilters(values)} />
				<UsersTable
					data={data?.results}
					loading={loading}
					pagination={pagination}
					setPagination={setPagination}
					sorters={sorters}
					setSorters={setSorters}
					filters={filters}
					setFilters={setFilters}
				/>
			</main>
		</section>
	)
}
