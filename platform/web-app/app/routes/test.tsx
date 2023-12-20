import React, {useEffect, useRef, useState, ReactPortal} from 'react';
import Handlebars from 'handlebars';
import {ActionFunctionArgs, redirect, json} from '@remix-run/node';
import {useActionData, Form, useSubmit, Link} from '@remix-run/react';
import ReactDOM from 'react-dom';

const probeTemplate = `
    <style>
    body {
        background-color: var(--gray-1);
    }
    button.blue {
        color: var(--blue-6);
        background-color: var(--blue-0);
        border: 1px solid var(--blue-1);
        border-radius: var(--radius-conditional-2);
        padding: var(--size-1) var(--size-2);

        &:hover {
            background-color: var(--blue-1);
        }
    }
    .card {
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: var(--size-2);
        padding: var(--size-3);
        border-radius: var(--radius-conditional-3);
        border: var(--border-size-1) solid var(--gray-4);
        box-shadow: var(--shadow-1);

        &:hover {
            box-shadow: var(--shadow-3);
        }
    }
    .input {
        padding: var(--size-1) var(--size-2);
        border-radius: var(--radius-conditional-2);
        border: var(--border-size-1) solid var(--gray-1);
    }
    img {
        width: 100px;
    }
    .link {
        color: var(--blue-4);
        &:hover {
            color: var(--blue-5);
        }
    }
    </style>
    <div>Probe Template</div>
    <div>{{name}}</div>
    <div class="card">
        <label htmlFor="email">Email</label>
        <div>
            <input class="input" data-action="sm1" type="email" name="email"/>
        </div>
        <div>
            <p data-error="email"></p>
        </div>
        <div>
            <button class="blue" data-action="sm1" type="submit">Sign Up</button>
        </div>
        <label htmlFor="password">Password</label>
        <div>
            <input class="input" data-action="sm2" type="password" name="password"/>
        </div>
        <div>
            <button class="blue" data-action="sm2" type="submit">Sign Up</button>
        </div>
        <div data-link="/test_2">
            <image  src="https://upload.wikimedia.org/wikipedia/commons/0/00/56_-_SNCF_TER_Alsace_510_at_Wissembourg%2C_August_6%2C_2010.jpg" />
        </div>
        <div data-link>
            <a href="/" class="link">Home</a>
        </div>
    </div>
`;

export async function action({request}: ActionFunctionArgs) {
    console.log('Test in action');
    const formData = await request.formData();
    // const submit1 = String(formData.get('submit-1'));
    // console.log('Submit 1: ', submit1);
    // const submit2 = String(formData.get('submit-2'));
    // console.log('Submit 2: ', submit2);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const action = String(formData.get("action"));
    console.log('formData: ', {
        action, email, password
    });

    const errors: any = {};

    if (!email.includes("@")) {
        errors.email = "Invalid email address";
    }

    if (password.length < 12) {
        errors.password =
            "Password should be at least 12 characters";
    }

    if (Object.keys(errors).length > 0) {
        return json({ errors });
    }

    // Redirect to dashboard if validation is successful
    return redirect("/");
}

type DataActionValuesGroup = Record<string, string>;

type DataActionValues = Record<string, DataActionValuesGroup>;

export default function Test() {
    const submit = useSubmit();
    const actionData = useActionData<typeof action>();
    const dataActionValues = useRef<DataActionValues>({});
    const isMounted = useRef<boolean>();
    // const [dataActionValues, setDataActionValues] = useState<DataActionValues>({});

    const [portals, setPortals] = useState<Array<ReactPortal>>([]);
    const data = {
        name: 'This is my name'
    };
    const template = Handlebars.compile(probeTemplate);
    const compiled = template(data);

    const submitDataActionGroup = (group: string) => {
        const foundDataActionValuesGroup: DataActionValuesGroup | undefined = dataActionValues.current[group];
        console.log('foundDataActionValuesGroup: ', group);
        console.log('foundDataActionValuesGroup: ', foundDataActionValuesGroup);
        if (foundDataActionValuesGroup) {
            const formData = new FormData();
            for (const [key, value] of Object.entries(foundDataActionValuesGroup)) {
                formData.append(key, String(value));
            }
            formData.append('action', group);
            submit(formData, { method: "post" });
        }
    };

    const handleChangeDataActionValue = (group: string) => (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (dataActionValues.current) {
            const newDataActionValues = {...dataActionValues.current};
            const newDataActionGroup = newDataActionValues[group] ? {...newDataActionValues[group]} : {};
            newDataActionGroup[target.name] = target.value;
            newDataActionValues[group] = newDataActionGroup;
            dataActionValues.current = newDataActionValues;
            console.log('New values: ', dataActionValues.current);
        }
    };

    const handleEnterKeyPress = (group: string) => (e: Event) => {
        console.log('(e as KeyboardEvent).key: ', (e as KeyboardEvent).key);
        if ((e as KeyboardEvent).key === 'Enter' && dataActionValues.current) {
            e.stopPropagation();
            e.preventDefault();
            submitDataActionGroup(group);
        }
    };

    const handleSubmitClick = (group: string) => (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        submitDataActionGroup(group);
    };

    useEffect(() => {
        if (!isMounted.current) {
            const elements = document.querySelectorAll('[data-action]');
            elements.forEach((element) => {
                const tag = element.tagName.toLowerCase();
                if (tag === 'input') {
                    const dataAction = element.getAttribute('data-action');
                    if (dataAction) {
                        console.log('Add event listeners');
                        element.addEventListener('input', handleChangeDataActionValue(dataAction));
                        element.addEventListener('keydown', handleEnterKeyPress(dataAction));
                    }
                }
            });
            const submits = document.querySelectorAll('button[type="submit"]');
            submits.forEach((submit) => {
                const dataAction = submit.getAttribute('data-action');
                if (dataAction) {
                    submit.addEventListener('click', handleSubmitClick(dataAction));
                }
            });

            const portals: Array<ReactPortal> = [];
            const links = document.querySelectorAll('[data-link]');
            if (links) {
                links.forEach((link) => {
                    const to = link.getAttribute('data-link');
                    let innerHTML = '<span>Undefined Link</span>';
                    if (link.innerHTML) {
                        innerHTML = link.innerHTML;
                    } else if (link.textContent) {
                        innerHTML = `<span>${link.textContent}</span>`;
                    }
                    link.innerHTML = '';
                    console.log('innerHTML: ', innerHTML);
                    portals.push(ReactDOM.createPortal(
                        <Link
                            to={to || '#'}
                            dangerouslySetInnerHTML={{__html: innerHTML}}
                        />,
                        link
                    ));
                });
                setPortals(portals);
                // // Cleanup: Unmount component when the parent unmounts
                // return () => {
                //     ReactDOM.unmountComponentAtNode(placeholder);
                // };
            }
            isMounted.current = true;
        }
    }, [isMounted.current]);

    console.log('Render');

    return (
        <Form method="post" onSubmit={(e) => {e.preventDefault()}}>
        <div className="p-4 flex flex-col gap-4">
            <h1>Test Page Here</h1>
            <div dangerouslySetInnerHTML={{__html: compiled}} />
            <hr/>
            {portals}
        </div>
        </Form>
    );
}
