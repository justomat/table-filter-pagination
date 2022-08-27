import React from 'react'
import { Button, Col, Divider, Form, Input, Row, Select } from 'antd'

const UsersTableHeader = ({
	onChange,
	initialValues = { username: '', gender: '' },
}) => {
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
			layout="vertical"
			initialValues={initialValues}
			onValuesChange={onChange}
		>
			<Row gutter={16} align="bottom">
				<Col>
					<Form.Item label="Search" name="username">
						<Input.Search placeholder="Search..." enterButton />
					</Form.Item>
				</Col>
				<Col>
					<Form.Item label="Gender" name="gender">
						<Select style={{ width: 200 }}>
							<Select.Option value="">All</Select.Option>
							<Select.Option value="male">Male</Select.Option>
							<Select.Option value="female">Female</Select.Option>
						</Select>
					</Form.Item>
				</Col>
				<Col>
					<Form.Item>
						<Button onClick={handleReset}>
							Reset Filter
						</Button>
					</Form.Item>
				</Col>
			</Row>
			<Divider />
		</Form>
	)
}

export default UsersTableHeader
