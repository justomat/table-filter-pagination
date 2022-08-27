import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import qs from 'qs'

// rename to words used by API
const toBackendParams = ({ pagination, sorters, filters }) => ({
	results: pagination?.pageSize,
	page: pagination?.current,
	...sorters,
	keyword: filters.username,
})

const toQueryString = params =>
	qs.stringify(toBackendParams(params), {
		filter: (_, value) => value || undefined,
	})

async function fetchUsers(params) {
	const response = await fetch(
		`https://randomuser.me/api?${toQueryString(params)}`
	)

	// prevent errors from being silently uncaught
	// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_that_the_fetch_was_successful
	if (!response.ok) {
		throw new Error('Oh no')
	} else {
		return response.json()
	}
}

export default function useUserList({ pagination, sorters, filters }) {
	const params = useMemo(
		() => ({ pagination, sorters, filters }),
		[pagination, sorters, filters]
	)
	const [debounced] = useDebounce(params, 500)
	return useQuery(['users', debounced], () => fetchUsers(debounced))
}
