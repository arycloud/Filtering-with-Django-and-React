import React from 'react';
import {
    Form, Select, InputNumber, Radio,
    Input, Button, DatePicker, Spin,
} from 'antd';

import Results from './Results';
import axios from 'axios';
const {Option} = Select;
const Search = Input.Search;
const {RangePicker } = DatePicker;


class FilterForm extends React.Component {
    state = {
        results: [],
        loading: false,
        error: null
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const title_contains =
                values['searchTitle'] === undefined ? null : values['searchTitle'];
            const title_exact =
                values['searchTitleID'] === undefined ? null : values['searchTitleID'];
            const title_or_author =
                values['searchTitleOrAuthor'] === undefined ? null : values['searchTitleOrAuthor'];
            const view_count_min =
                values['minimum-views'] === undefined ? null : values['minimum-views'];
            const view_count_max =
                values['maximum-views'] === undefined ? null : values['maximum-views'];
            const category =
                values['category'] === undefined ? null : values['category'];
            let reviewed =
                values['reviewed'] === undefined ? null : values['reviewed'];
            let not_reviewed = undefined;
            if (reviewed === 'reviewed'){
                reviewed = 'on';
                not_reviewed = 'off'
            } else if(reviewed === 'not_reviewed'){
                reviewed = null;
                not_reviewed = "on";
            }
            const rangeValue = values['date-range'];
            const date_min = rangeValue === undefined ? null : rangeValue[0].format('YYYY-MM-DD');
            const date_max = rangeValue === undefined ? null : rangeValue[1].format('YYYY-MM-DD');

            this.setState({loading: true});

            if (!err) {
                axios.get('http://127.0.0.1:8000/api/', {
                    params:{
                        title_contains,
                        title_exact,
                        title_or_author,
                        view_count_min,
                        view_count_max,
                        date_min,
                        date_max,
                        category,
                        reviewed,
                        not_reviewed
                    }
                })
                .then( res => {
                    this.setState({
                        loading: false,
                        results: res.data
                    })
                })
                .catch(err => {
                    this.setState({error: 'There was an error'});
                    console.log(err);
                });
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        const {error, loading, results} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 12, offset: 6},
        };
        return (
            <div>
                {error && <span>There wa san error</span>}
                <Form { ...formItemLayout } onSubmit={ this.handleSubmit }>
                <Form.Item>
                    <h1>Journal Filter</h1>
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('searchTitle')(<Search
                        placeholder="title contains..."
                        onSearch={ value => console.log(value) }
                        enterButton
                    />)}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('searchTitleID')(<Search
                        placeholder="Exact ID..."
                        onSearch={ value => console.log(value) }
                        enterButton
                    />)}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('searchTitleOrAuthor')(<Search
                        placeholder="title or author..."
                        onSearch={ value => console.log(value) }
                        enterButton
                    />)}
                </Form.Item>
                <Form.Item
                    label=""
                    hasFeedback
                >
                    { getFieldDecorator('category')(
                        <Select placeholder="Please select a category">
                            <Option value="Sport">Sport</Option>
                            <Option value="Lifestyle">Lifestyle</Option>
                            <Option value="Coding">Coding</Option>
                            <Option value="Travelling">Travelling</Option>
                        </Select>
                    ) }
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('range-time-picker')(
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                  )}
                </Form.Item>
                <Form.Item label="">
                    { getFieldDecorator('minimum-views')(
                        <InputNumber min={ 0 } placeholder="0"/>
                    ) }
                    <span className="ant-form-text"> Minimum views</span>
                </Form.Item>
                <Form.Item label="">
                    { getFieldDecorator('maximum-views')(
                        <InputNumber max={ 1000 } placeholder="1000"/>
                    ) }
                    <span className="ant-form-text"> Maximum views</span>
                </Form.Item>

                <Form.Item
                    label=""
                >
                    { getFieldDecorator('reviewed')(
                        <Radio.Group>
                            <Radio value="reviewed">Reviewed</Radio>
                            <Radio value="not_reviewed">Not reviewed</Radio>
                        </Radio.Group>
                    ) }
                </Form.Item>


                <Form.Item
                    wrapperCol={ {offset: 16} }
                >
                    <Button type="primary" className='btn pull-right' htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
                {
                    loading ? (<div className="loader-div"> <Spin /> </div>) : (<Results journals={results}/> )
                }

            </div>
        );
    }
}

const WrappedFilterForm = Form.create({name: 'validate_other'})(FilterForm);

export default WrappedFilterForm;
