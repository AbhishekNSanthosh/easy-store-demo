import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Subdomain {
    subdomain: string;
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { subdomain }: Subdomain = await request.json();

        // Check if subdomain is provided
        if (!subdomain) {
            return NextResponse.json(
                { error: 'Subdomain is required' },
                { status: 400 }
            );
        }

        // Define the path to the subdomains JSON file
        const filePath = path.join(process.cwd(), '/tmp/subdomains.json');

        // Read the file containing existing subdomains
        const fileData = fs.readFileSync(filePath, 'utf8');
        const subdomains: Subdomain[] = JSON.parse(fileData);

        // Check if the subdomain already exists
        const subdomainExists = subdomains.some(
            (existingSubdomain) => existingSubdomain.subdomain === subdomain
        );

        if (subdomainExists) {
            return NextResponse.json(
                { error: 'Subdomain already exists' },
                { status: 400 }
            );
        }

        // Add the new subdomain to the list
        subdomains.push({ subdomain });

        // Write the updated list back to the file
        fs.writeFileSync(filePath, JSON.stringify(subdomains, null, 2));

        return NextResponse.json(
            { message: 'Subdomain added successfully' },
            { status: 200 }
        );
    } catch (error) {
        // Log the error and return a generic error message to the client
        console.error('Error adding subdomain:', error);

        return NextResponse.json(
            { error: 'An unexpected error occurred', data:error },
            { status: 500 }
        );
    }
}
