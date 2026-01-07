"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PenLine } from "lucide-react"

interface ExplanationDialogProps {
    orderNumber: string;
    initialExplanation?: string;
}

export function ExplanationDialog({ orderNumber, initialExplanation = "" }: ExplanationDialogProps) {
    const [open, setOpen] = useState(false);
    const [explanation, setExplanation] = useState(initialExplanation);

    const handleSave = () => {
        // 여기에 나중에 Supabase 저장 로직이 들어갑니다.
        console.log(`[저장됨] 오더번호: ${orderNumber}, 사유: ${explanation}`);

        // 저장 후 팝업 닫기
        setOpen(false);
        alert("소명 내용이 임시 저장되었습니다. (콘솔 확인)");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <PenLine size={14} />
                    소명 작성
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>오더 소명 작성</DialogTitle>
                    <DialogDescription>
                        오더 <strong>{orderNumber}</strong>의 마감 지연/불일치 사유를 입력해주세요.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="explanation" className="">
                            사유 입력
                        </Label>
                        <Textarea
                            id="explanation"
                            placeholder="예: 1월 입고분이나 시스템 오류로 2월 투입 처리됨."
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            className="h-32"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave}>저장하기</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}