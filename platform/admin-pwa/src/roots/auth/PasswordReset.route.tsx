import {Form, LoaderFunctionArgs, useActionData, json, redirect, useNavigation} from 'react-router-dom';
import * as z from 'zod';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {post} from '@/utils/ClientApi';
import {AuthResponse} from 'common-utils';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';

const forgotFormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    })
});

export async function passwordResetAction({request}: LoaderFunctionArgs) {
    switch (request.method) {
        case "POST": {
            let formData = await request.formData();
            const data = Object.fromEntries(formData);
            const validationResult = forgotFormSchema.safeParse(data);
            if (!validationResult.success) {
                const formatted = validationResult.error.format();
                return json(formatted);
            }
            try {
                const authResponse = await post<AuthResponse>('/api/post-sys-user-auth-reset-start', data);
                if (authResponse) {
                    return redirect('/password-reset-confirm');
                }
                return json({error: 'Missing auth response'});
            } catch (e: any) {
                return json({error: e.message});
            }
        }
        default: {
            throw new Response("", {status: 405});
        }
    }
}

export function PasswordResetRoute() {
    const actionData: any = useActionData();
    let navigation = useNavigation();
    const isLoading = !!navigation.formData?.get('username');
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
            <Form method="post">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>Reset password of your account</CardDescription>
                        <ActionDataRequestError actionData={actionData}/>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-6">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">User Name</Label>
                                <Input autoFocus={true} name="username"/>
                                <ActionDataFieldError actionData={actionData} fieldName="username"/>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            Reset Password
                        </Button>
                    </CardFooter>
                </Card>
            </Form>
        </div>
    );
}
