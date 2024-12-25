"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChangeEvent, useRef, useState } from "react";
import CloudinaryImageUpload from "haq-cloudinary";
import { useSession } from "next-auth/react";
import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { CopyMinus, Trash2 } from "lucide-react";
import Image from "next/image";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().nonempty({
    message: "Description must be provided",
  }),
  category: z.string().nonempty({
    message: "Category must be provided",
  }),
  imageURL: z.string().nonempty({
    message: "Image must be provided",
  }),
});

const CREATE_BLOG_MUTATION = gql`
  mutation AddLink(
    $title: String!
    $description: String!
    $categories: String!
    $imageURL: String!
    $url: String!
    $userId: String!
  ) {
    addLink(
      title: $title
      description: $description
      categories: $categories
      imageURL: $imageURL
      url: $url
      userId: $userId
    ) {
      id
      title
      description
      categories
      imageURL
      url
      user {
        id
        name
      }
    }
  }
`;

const CreateBlog = () => {
  const session = useSession();

  const { id: loggedInUserId = "" } = session?.data?.user || {};
  const { image: loggedInUserImage } = session?.data?.user;

  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [addLink, { loading }] = useMutation(CREATE_BLOG_MUTATION);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      imageURL: "",
    },
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!image) {
      throw new Error("Image is required");
    }

    const fileData = await CloudinaryImageUpload({
      file: image,
      preset: "prisma-blog-app",
      cloudName: "djdkjrlp8",
    });

    const variables = {
      title: data.title,
      description: data.description,
      categories: data.category,
      imageURL: fileData.secure_url,
      url: loggedInUserImage,
      userId: loggedInUserId,
    };

    try {
      const { data: response } = await addLink({
        variables,
      });

      // Clear the form
      form.reset();
      setImage(null);
      setPreviewImage(null);

      toast("Blog published successfully", {
        action: {
          label: <CopyMinus size={16} />,
          onClick: () => console.log("Minus"),
        },
      });

      console.log("Blog created successfully:", response.addLink);
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  }

  const handleClearImage = () => {
    setImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  return (
    <Card className="p-4 w-1/2 mx-auto">
      <div className="flex flex-col justify-center items-center p-4 gap-2">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-500">
          Create Your Post
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Your blog desc" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Your blog category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {previewImage && (
            <div className="preview-image w-full h-72 relative bg-center bg-cover">
              <Trash2
                onClick={handleClearImage}
                className="absolute top-3 right-3 transition-all ease-in-out duration-300 bg-red-900 text-slate-400 p-2 cursor-pointer rounded hover:bg-red-600 hover:text-white hover:transition-all hover:ease-in-out hover:duration-300"
                size={30}
              />
              <Image
                className="w-full h-full object-cover rounded-sm back-center"
                src={previewImage}
                alt="preview-image"
                height={300}
                width={400}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="imageURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder="Upload Your Image"
                    ref={fileInputRef}
                    onChange={(e) => {
                      handleOnChange(e); 
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-end">
            <Button disabled={loading} type="submit">
              {loading ? "Creating . . ." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default CreateBlog;
